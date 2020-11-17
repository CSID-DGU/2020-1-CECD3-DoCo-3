const config = require('../config.js');
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const name = req.query.roomName;
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });
    // Might need to put below into database?
    rooms[name] = new Room(mediasoupRouter.id, mediasoupRouter);
    res.json({roomName: name});
});




module.exports = router;