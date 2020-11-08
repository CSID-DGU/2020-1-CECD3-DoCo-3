const config = require('../config.js');
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
      
        const transport = await currentRoom.getRouter().createWebRtcTransport({
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
        var producerTransportId=currentRoom.roomId + "_host";
        const producer = await currentRoom.getActiveProducerTransport(transport.id).transport.produce({ kind, rtpParameters });
        currentRoom.addActiveProducerToTransport(transport.id, producer);
    
        } catch (err) { 
            console.log(err)
            return
      }
     

    if (!device.canProduce('video')) {
        console.error('cannot produce video');
        return;
      }
    
    let stream;

    try {
      stream =  await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const params = { track };
    //   if ($chkSimulcast.checked) {
    //     params.encodings = [
    //       { maxBitrate: 100000 },
    //       { maxBitrate: 300000 },
    //       { maxBitrate: 900000 },
    //     ];
        params.codecOptions = {
          videoGoogleStartBitrate : 1000
      //  };
      }
      producer = await transport.produce(params);
    } catch (err) {
        console.log(err)
            return
      //$txtPublish.innerHTML = 'failed';
    }
    
    document.querySelector('#my_video').srcObject = await stream;

    res.render('host')
})

module.exports = router;