const config = require('../config.js');
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });
    
    rooms[mediasoupRouter.id] = new Room(mediasoupRouter.id, mediasoupRouter);

    const {
        maxIncomingBitrate,
        initialAvailableOutgoingBitrate
    } = config.mediasoup.webRtcTransport;
    const transport = rooms[mediasoupRouter.id].getRouter().createWebRtcTransport({
        listenIps: config.mediasoup.webRtcTransport.listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate,
    });
  
    // if (maxIncomingBitrate) {
    //     try {
    //       await transport.setMaxIncomingBitrate(maxIncomingBitrate);
    //     } catch (error) {
    //     }
    // }
    let data = {
        transport,
        params: {
          id: mediasoupRouter.id + '_host',
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters
        }
    }
    rooms[mediasoupRouter.id].addActiveProducerTransport(data);
    res.json({roomId: mediasoupRouter.id});
});

module.exports = router;