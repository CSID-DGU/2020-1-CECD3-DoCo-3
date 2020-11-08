
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