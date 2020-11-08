const config = require('../config.js');
const express = require('express');
const router = express.Router();
const config = require('../config.js')
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }

<<<<<<< HEAD
    try {
        const { transport, params } = await createWebRtcTransport(currentRoom.roomId);
        currentRoom.addActiveProducerTransport(transport);
        var kind = "video";
        var dtlsParameters = transport.dtlsParameters;
        console.log('loading...')
        const producer = await currentRoom.getActiveProducerTransport(transport.id).transport.produce({ kind, dtlsParameters});
        currentRoom.addActiveProducerToTransport(transport.id, producer);
        console.log('Created...')
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
=======
    res.locals.roomId = roomId
    
>>>>>>> 46f6b2746ba58eb0ac0a7a4ccac560cd9698d764
    
    document.querySelector('#my_video').srcObject = await stream;

    res.render('host')
})

module.exports = router;

// const transport = device.createSendTransport(data);
//   transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
//     socket.request('connectProducerTransport', { dtlsParameters })
//       .then(callback)
//       .catch(errback);
//   });

//   transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
//     try {
//       const { id } = await socket.request('produce', {
//         transportId: transport.id,
//         kind,
//         rtpParameters,
//       });
//       callback({ id });
//     } catch (err) {
//       errback(err);
//     }
//   });

//   transport.on('connectionstatechange', (state) => {
//     switch (state) {
//       case 'connecting':
//         $txtPublish.innerHTML = 'publishing...';
//         $fsPublish.disabled = true;
//         $fsSubscribe.disabled = true;
//       break;

//       case 'connected':
//         document.querySelector('#local_video').srcObject = stream;
//         $txtPublish.innerHTML = 'published';
//         $fsPublish.disabled = true;
//         $fsSubscribe.disabled = false;
//       break;

//       case 'failed':
//         transport.close();
//         $txtPublish.innerHTML = 'failed';
//         $fsPublish.disabled = false;
//         $fsSubscribe.disabled = true;
//       break;

//       default: break;
//     }
//   });

//   let stream;
//   try {
//     stream = await getUserMedia(transport, isWebcam);
//     const track = stream.getVideoTracks()[0];
//     const params = { track };
//     if ($chkSimulcast.checked) {
//       params.encodings = [
//         { maxBitrate: 100000 },
//         { maxBitrate: 300000 },
//         { maxBitrate: 900000 },
//       ];
//       params.codecOptions = {
//         videoGoogleStartBitrate : 1000
//       };
//     }
//     producer = await transport.produce(params);
//   } catch (err) {
//     $txtPublish.innerHTML = 'failed';
//   }
