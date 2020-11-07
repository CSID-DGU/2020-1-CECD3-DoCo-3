const mediasoup = require("mediasoup");
const config = require('../config.js');
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, next) => {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });
    // Might need to put below into database?
    rooms[mediasoupRouter.id] = new Room(mediasoupRouter.id, mediasoupRouter);
    res.json({roomId: mediasoupRouter.id, rs: rooms});
  });

module.exports = router;