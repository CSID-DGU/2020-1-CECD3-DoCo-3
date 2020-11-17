const express = require('express');
const router = express.Router();
const socketPromise = require('../lib/socket.io-promise').promise;

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }  

    // const opts = {
    //   path: '/rooms',
    //   transports: ['websocket'],
    // };

    // const hostname = window.location.hostname;
    // const serverUrl = `https://${hostname}`;
    // socket = socketClient(serverUrl, opts);
    // console.log(socket);
    // socket.request = socketPromise(socket);
  
    // socket.on('connect', async () => {
    //   const data = await socket.request('getRouterRtpCapabilities');
    //   await loadDevice(data);
    // });
  
    // socket.on('connect_error', (error) => {
    //   console.error('could not connect to %s%s (%s)', serverUrl, opts.path, error.message);
    // });
        
    // async function loadDevice(routerRtpCapabilities) {
    //   try {
    //     device = new mediasoup.Device();
    //   } catch (error) {
    //     if (error.name === 'UnsupportedError') {
    //       console.error('browser not supported');
    //     }
    //   }
    //   await device.load({ routerRtpCapabilities });
    // }

    // try {
      
    //   const track = clientStream.getVideoTracks()[0];
    //   const params = { track };
    //     params.codecOptions = {
    //       videoGoogleStartBitrate : 1000
    //   }
    //   producer = await currentRoom.getActiveProducerTransport().produce(params);
    // } catch (err) {
    //     console.log(err)
    //         return
    //   //$txtPublish.innerHTML = 'failed';
    // }
    
    

    res.send();
})

module.exports = router;