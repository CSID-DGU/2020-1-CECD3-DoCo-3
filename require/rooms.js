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
    console.log('Created WebRtcTransport...')
    if (maxIncomingBitrate) {
        try {
            await transport.setMaxIncomingBitrate(maxIncomingBitrate);
        } catch (error) {
        }
    }

    console.log(transport)
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
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }

    const { transport, params } = await createWebRtcTransport(roomId);
    rooms[roomId].addActiveConsumerTransport(transport, roomId + '_host', roomId + '_parents_host');
    
    const ctransport = await rooms[data.roomId].getActiveConsumerTransport(data.transportId).transport.connect({ dtlsParameters: data.dtlsParameters });

    // console.log(ctransport)
    // let producer = producerTransport.videoProducer //producerTransport.audioProducer;
    // if (!currentRoom.getRouter().canConsume(
    //     {
    //       producerId: producer.id,
    //       rtpCapabilities,
    //     })
    // )

    // try {
    //     let trs = await currentRoom.getActiveConsumerTransport(consumerTranportId).transport.consume({
    //         producerId: producer.id,
    //         rtpCapabilities,
    //         paused: true,
    //     });
    //     currentRoom.addActiveConsumerToTransport(consumerTransportId, consumer);

    //     if (consumer.type === 'simulcast') {
    //         await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
    //     }
    //     let info = {
    //         producerId: producer.id,
    //         producerTransportId: producerTransportId,
    //         id: trs.id,
    //         consumerTransportId: consumerTransportId,
    //         kind: trs.kind,
    //         rtpParameters: trs.rtpParameters,
    //         type: trs.type,
    //         producerPaused: trs.producerPaused
    //     };

    //     console.log(info)
    //     const consumer = trs.consume(info)
    //     const stream = new MediaStream();
    //     stream.addTrack(consumer.track);

    //     res.locals.stream = stream
    //     res.render('r')
    // } catch(e) {
    //     console.error('consume failed', error);
    //     return
    // }

    res.render('r')
})

module.exports = router;