const config = require('../config.js');
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const mediasoupRouter = await worker.createRouter({ mediaCodecs });
    // Might need to put below into database?
    rooms[mediasoupRouter.id] = new Room(mediasoupRouter.id, mediasoupRouter);
    const currentRoom = rooms[mediasoupRouter.id]

    const {
        maxIncomingBitrate,
        initialAvailableOutgoingBitrate
      } = config.mediasoup.webRtcTransport;
      const transport = await currentRoom.getRouter().createWebRtcTransport({
        listenIps: config.mediasoup.webRtcTransport.listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate,
      });
  
      if (maxIncomingBitrate) {
        try {
          await transport.setMaxIncomingBitrate(maxIncomingBitrate);
        } catch (error) {
        }
      }
  
      currentRoom.addActiveProducerTransport({
        transport,
        params: {
          id: roomId + '_host',
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters
        }
      });
  
      
    res.json({roomId: mediasoupRouter.id});
});

module.exports = router;