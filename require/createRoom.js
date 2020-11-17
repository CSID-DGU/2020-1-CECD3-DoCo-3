const config = require('../config.js');
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });
    
    rooms[mediasoupRouter.id] = new Room(mediasoupRouter.id, mediasoupRouter);

    const { transport, params } = await createWebRtcTransport(mediasoupRouter.id)
    rooms[mediasoupRouter.id].addActiveProducerTransport(transport);

    res.redirect('/host?roomId='+ mediasoupRouter.id + '&prodId='+ transport.id);
});




module.exports = router;