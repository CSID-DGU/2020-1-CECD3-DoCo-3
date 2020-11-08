const mediasoup = require("mediasoup");
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const data = rooms[roomId].getRouter().rtpCapabilities

    console.log(data)
    const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
      });
      const stream = new MediaStream();
      stream.addTrack(consumer.track);
    res.locals.stream = stream

    res.render('r')
})

module.exports = router;