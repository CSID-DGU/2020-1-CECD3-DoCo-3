const mediasoup = require('mediasoup');
const fs = require('fs');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const config = require('./config');
const Room = require('./ourRoom');

// Global variables
let worker;
let webServer;
let socketServer;
let expressApp;


let consumer;

let rooms = {};

(async () => {
  try {
    await runExpressApp();
    await runWebServer();
    await runSocketServer();
    await runMediasoupWorker();
  } catch (err) {
    console.error(err);
  }
})();



async function runExpressApp() {
  expressApp = express();
  expressApp.use(express.json());
  expressApp.use(express.static(__dirname));

  expressApp.get("/createRoom", async (req, res, next) => {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });

    rooms[mediasoupRouter.id] = new Room(mediasoupRouter.id, mediasoupRouter);
    res.json({roomId: mediasoupRouter.id});
  });
  
  expressApp.get("/roomExists", async (req, res, next) => {
    const roomId = req.query.roomId;
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });

    rooms[roomId].otherRouters[mediasoupRouter.id] = mediasoupRouter;
    res.json({ exists: roomId in rooms, clientId: mediasoupRouter.id });
  });

  expressApp.get("/roomClients", async (req, res, next) => {
    const roomId = req.query.roomId;
    const ptprt = rooms[roomId].producerTransport
    var roomList = [];
    for(key in ptprt) { roomList.push(key); }

    res.json(roomList);
  });

  expressApp.get("/roomList", async (req, res) => {
    var roomList = [];
    for(key in rooms){
        roomList.push(rooms[key].roomId);
    }

    res.json(roomList);
  })

  expressApp.use((error, req, res, next) => {
    if (error) {
      console.warn('Express app error,', error.message);

      error.status = error.status || (error.name === 'TypeError' ? 400 : 500);

      res.statusMessage = error.message;
      res.status(error.status).send(String(error));
    } else {
      next();
    }
  });
}

async function runWebServer() {
  webServer = http.createServer(expressApp);
  webServer.on('error', (err) => {
    console.error('starting web server failed:', err.message);
  });

  await new Promise((resolve) => {
    const { listenIp, listenPort } = config;
    webServer.listen(listenPort, listenIp, () => {
      const listenIps = config.mediasoup.webRtcTransport.listenIps[0];
      const ip = listenIps.announcedIp || listenIps.ip;
      console.log('server is running');
      console.log(`open https://${ip}:${listenPort} in your web browser`);
      resolve();
    });
  });
}

async function runMediasoupWorker() {
  worker = await mediasoup.createWorker({
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
    rtcMinPort: config.mediasoup.worker.rtcMinPort,
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
  });

  worker.on('died', () => {
    console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
    setTimeout(() => process.exit(1), 2000);
  });

  console.log('Worker is ready')
}

async function runSocketServer() {
  socketServer = socketIO(webServer, {
    serveClient: false,
    path: '/server',
    log: false,
  });

  socketServer.on('connection', (socket) => {
    console.log(socket.id + ', client connected');

    socket.on('roomExists', async (data) => {
      socket.emit('validRoom', data in rooms);
    });

    socket.on('joinRoom', (data) => {
      // Have the user join a specific room
      socket.join(data.roomId);
    });

    socket.on('disconnect', () => {
      socket.leave(socket.id);
      console.log('client disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('client connection error', err);
    });

    socket.on('getRouterRtpCapabilities', (data, callback) => {
      callback(rooms[data.roomId].hostRouterObj.rtpCapabilities);
    });

    // !< FOR GUEST
    // socket.on('getGuestRouterRtpCapabilities', (data, callback) => {
    //   var roomList = [];
    //   for(router in rooms[roomId].otherRouters){
    //       roomList.push(router.rtpCapabilities);
    //   }
    //   callback(roomList);
    // });

    socket.on('createProducerTransport', async (data, callback) => {
      try {
        const { transport, params } = await createWebRtcTransport(data.roomId);
        rooms[data.roomId].producerTransport[data.cId] = transport;
        callback(params);
      } catch (err) {
        console.error(err);
        callback({ error: err.message });
      }
    });

    socket.on('createConsumerTransport', async (data, callback) => {
      try {
        const { transport, params } = await createWebRtcTransport(data.roomId);
        rooms[data.roomId].consumerTransport[data.cId] = transport;
        callback(params);
      } catch (err) {
        console.error(err);
        callback({ error: err.message });
      }
    });

    // socket.on('getConsumerTransport', async (data, callback) => {
    //   try {
    //     const transport = rooms[data.roomId].consumerTransport[data.cId];
    //     const params = {
    //       id: transport.id,
    //       iceParameters: transport.iceParameters,
    //       iceCandidates: transport.iceCandidates,
    //       dtlsParameters: transport.dtlsParameters
    //     }
    //     callback(params);
    //   } catch (err) {
    //     console.error(err);
    //     callback({ error: err.message });
    //   }
    // });

    socket.on('connectProducerTransport', async (data, callback) => {
      await rooms[data.roomId].producerTransport[data.cId].connect({ dtlsParameters: data.dtlsParameters });
      callback();
    });

    socket.on('connectConsumerTransport', async (data, callback) => {
      await rooms[data.roomId].consumerTransport[data.cId].connect({ dtlsParameters: data.dtlsParameters });
      callback();
    });

    socket.on('produce', async (data, callback) => {
      const {kind, rtpParameters} = data;
      rooms[data.roomId].producer = await rooms[data.roomId].producerTransport[data.cId].produce({ kind, rtpParameters });
      callback({ id: rooms[data.roomId].producer.id });

      socket.broadcast.to(socket.id).emit('newProducer');
    });

    socket.on('clientproduce', async (data, callback) => {
      const {kind, rtpParameters} = data;
      rooms[data.roomId].consumers[data.cId] = await rooms[data.roomId].consumerTransport[data.cId].produce({ kind, rtpParameters });
      console.log('CLIENTPRODUCE ::::::::::: ' + rooms[data.roomId].consumers[data.cId].id)
      callback({ id: rooms[data.roomId].consumers[data.cId].id });

      socket.broadcast.to(socket.id).emit('newCProducer');
    });

    socket.on('consume', async (data, callback) => {
      callback(await createConsumer(rooms[data.roomId].producer, data.rtpCapabilities, data.roomId, data.cId));
    });

    socket.on('resume', async (data, callback) => {
      await consumer.resume();
      callback();
    });
  });
}

async function createWebRtcTransport(roomId) {
  const {
    maxIncomingBitrate,
    initialAvailableOutgoingBitrate
  } = config.mediasoup.webRtcTransport;

  const transport = await rooms[roomId].hostRouterObj.createWebRtcTransport({
    listenIps: config.mediasoup.webRtcTransport.listenIps,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate,
  });
  if (maxIncomingBitrate) {
    try {
      await transport.setMaxIncomingBitrate(maxIncomingBitrate);
    } catch (error) {
    }
  }
  return {
    transport,
    params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    },
  };
}

async function createConsumer(producer, rtpCapabilities, roomId, cId) {
  if (!rooms[roomId].hostRouterObj.canConsume(
    {
      producerId: producer.id,
      rtpCapabilities,
    })
  ) {
    console.error('can not consume');
    return;
  }
  try {
    consumer = await rooms[roomId].consumerTransport[cId].consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: producer.kind === 'video',
    });
  } catch (error) {
    console.error('consume failed', error);
    return;
  }

  if (consumer.type === 'simulcast') {
    await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
  }

  return {
    producerId: producer.id,
    id: consumer.id,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
    type: consumer.type,
    producerPaused: consumer.producerPaused
  };
}
