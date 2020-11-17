const config = require('../config.js');
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

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

    //console.log(transport)
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

router.get('/', async (req, res, _) => {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });
    
    rooms[mediasoupRouter.id] = new Room(mediasoupRouter.id, mediasoupRouter);

    const { transport, params } = await createWebRtcTransport(mediasoupRouter.id)
    rooms[mediasoupRouter.id].addActiveProducerTransport(transport);

    res.redirect('/host?roomId='+ mediasoupRouter.id + '&prodId='+ transport.id);
    //res.json({roomId: mediasoupRouter.id, prodId: transport.id});
});



module.exports = router;