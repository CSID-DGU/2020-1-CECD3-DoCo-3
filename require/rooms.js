const mediasoup = require("mediasoup");
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }
    const producerTransport = currentRoom.getActiveProducerTransport(roomId + '_host');
    let producer = producerTransport.videoProducer //producerTransport.audioProducer;
    if (!currentRoom.getRouter().canConsume(
        {
          producerId: producer.id,
          rtpCapabilities,
        })
    )

    try {
        let trs = await currentRoom.getActiveConsumerTransport(consumerTranportId).transport.consume({
            producerId: producer.id,
            rtpCapabilities,
            paused: true,
        });
        currentRoom.addActiveConsumerToTransport(consumerTransportId, consumer);

        if (consumer.type === 'simulcast') {
            await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
        }
        let info = {
            producerId: producer.id,
            producerTransportId: producerTransportId,
            id: trs.id,
            consumerTransportId: consumerTransportId,
            kind: trs.kind,
            rtpParameters: trs.rtpParameters,
            type: trs.type,
            producerPaused: trs.producerPaused
        };

        console.log(info)
        const consumer = trs.consume(info)
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        res.locals.stream = stream
    } catch(e) {
        console.error('consume failed', error);
        return
    }



    res.render('r')
})

module.exports = router;