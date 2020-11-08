const mediasoup = require("mediasoup");
const express = require('express');
const router = express.Router();
const Room = require('../room.js');
const mediasoup = require('mediasoup-client');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }

    try {
        const { transport, params } = await createWebRtcTransport(currentRoom.roomId);
        currentRoom.addActiveProducerTransport(transport);
        } catch (err) { 
      }

    const producer = await currentRoom.getActiveProducerTransport(producerTransportId).transport.produce({ kind, rtpParameters });
    currentRoom.addActiveProducerToTransport(producerTransportId, producer);
    
    res.render('host')
})

module.exports = router;