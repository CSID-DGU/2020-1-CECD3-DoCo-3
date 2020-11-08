const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const data = rooms[roomId].getRouter().rtpCapabilities
    //res.locals.stream = data

    const transport = device.createSendTransport(data);
    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      socket.request('connectProducerTransport', { dtlsParameters })
        .then(callback)
        .catch(errback);
    });
  
    transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { id } = await socket.request('produce', {
          transportId: transport.id,
          kind,
          rtpParameters,
        });
        callback({ id });
      } catch (err) {
        errback(err);
      }
    });
  
    transport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connected':
          document.querySelector('#local_video').srcObject = stream;
        break;
  
        case 'failed':
          transport.close();
        break;
  
        default: break;
      }
    });
  
    let stream;
    try {
      stream = await getUserMedia(transport, isWebcam);
      const track = stream.getVideoTracks()[0];
      const params = { track };
      if ($chkSimulcast.checked) {
        params.encodings = [
          { maxBitrate: 100000 },
          { maxBitrate: 300000 },
          { maxBitrate: 900000 },
        ];
        params.codecOptions = {
          videoGoogleStartBitrate : 1000
        };
      }
      producer = await transport.produce(params);
    } catch (err) {
      console.log(err)
    }
    
    
    res.render('host')
})

async function publish(e) {
    const isWebcam = (e.target.id === 'btn_webcam');
  
    const data = await socket.request('createProducerTransport', {
      forceTcp: false,
      rtpCapabilities: device.rtpCapabilities,
    });
    console.log(data);
    if (data.error) {
      console.error(data.error);
      return;
    }
  
    const transport = device.createSendTransport(data);
    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      socket.request('connectProducerTransport', { dtlsParameters })
        .then(callback)
        .catch(errback);
    });
  
    transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { id } = await socket.request('produce', {
          transportId: transport.id,
          kind,
          rtpParameters,
        });
        callback({ id });
      } catch (err) {
        errback(err);
      }
    });
  
    transport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connected':
          document.querySelector('#local_video').srcObject = stream;
        break;
  
        case 'failed':
          transport.close();
        break;
  
        default: break;
      }
    });
  
    let stream;
    try {
      stream = await getUserMedia(transport, isWebcam);
      const track = stream.getVideoTracks()[0];
      const params = { track };
      if ($chkSimulcast.checked) {
        params.encodings = [
          { maxBitrate: 100000 },
          { maxBitrate: 300000 },
          { maxBitrate: 900000 },
        ];
        params.codecOptions = {
          videoGoogleStartBitrate : 1000
        };
      }
      producer = await transport.produce(params);
    } catch (err) {
      console.log(err)
    }
}

module.exports = router;