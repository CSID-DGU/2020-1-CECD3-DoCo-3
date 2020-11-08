const config = require('../config.js');
const express = require('express');
const router = express.Router();
const Room = require('../room.js');
const { createWebRtcTransport } = require('./functions/createWebRtcTransport.js')

router.get('/', async (req, res, _) => {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });
    
    rooms[mediasoupRouter.id] = new Room(mediasoupRouter.id, mediasoupRouter);

    const { transport, params } = await createWebRtcTransport(mediasoupRouter.id)
    rooms[mediasoupRouter.id].addActiveProducerTransport(transport);
    res.json({roomId: mediasoupRouter.id});
});



module.exports = router;