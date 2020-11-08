const mediasoup = require("mediasoup");
const express = require('express');
const router = express.Router();
const Room = require('../room.js');
const config = require('../config.js');

async function createWebRtcTransport(roomId) {
    const {
        maxIncomingBitrate,
        initialAvailableOutgoingBitrate
    } = config.mediasoup.webRtcTransport;
  
    const transport = await rooms[roomId].getRouter().createWebRtcTransport({
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

async function createConsumer(producerTransportId, kind, rtpCapabilities, consumerTransportId, roomId) {
    console.log("In createConsumer...");
    console.log(rooms[roomId].getActiveProducerTransports())
    const producerTransport = rooms[roomId].getActiveProducerTransport(producerTransportId);
    var producer = kind === "video" ? producerTransport.videoProducer : producerTransport.audioProducer;
    if (!rooms[roomId].getRouter().canConsume(
      {
        producerId: producer.id,
        rtpCapabilities,
      })
    ) {
      console.error('cannot consume');
      return;
    }

    try {
      consumer = await rooms[roomId].getActiveConsumerTransport(consumerTransportId).transport.consume({
        producerId: producer.id,
        rtpCapabilities,
        paused: producer.kind === 'video',
        // paused: false,
      });
      rooms[roomId].addActiveConsumerToTransport(consumerTransportId, consumer);
    } catch (error) {
      console.error('consume failed', error);
      return;
    }
  
    if (consumer.type === 'simulcast') {
      await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
    }
  
    return {
      producerId: producer.id,
      producerTransportId: producerTransportId,
      id: consumer.id,
      consumerTransportId: consumerTransportId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused
    };
  }

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const prodId = req.query.prodId;

    const { transport, params } = await createWebRtcTransport(roomId);
    rooms[roomId].addActiveConsumerTransport(transport, prodId, prodId);
    
    await transport.connect({ dtlsParameters: params.dtlsParameters });
    
    transport.on('connectionstatechange', async (state) => {
        switch (state) {
          case 'connected':
            console.log('connected');
            res.locals.stream = await stream;
            
            break;
    
          case 'failed':
            transport.close();
            $txtSubscription.innerHTML = 'failed';
            $fsSubscribe.disabled = false;
            break;
    
          default: console.log(state);
        }
    });

    const {
        producerId,
        id,
        kind,
        rtpParameters,
      } = await createConsumer(roomId, 'video', rooms[roomId].rtpCapabilities, transport.id, roomId)
    let codecOptions = {};
    const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
    });

    const stream = new MediaStream();
    stream.addTrack(consumer.track);
    
    res.render('r')
})

module.exports = router;