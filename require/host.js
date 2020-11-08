const express = require('express');
const router = express.Router();
const Room = require('../room.js');


const hostname = window.location.hostname;

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }  
    
    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      producer = await currentRoom.getActiveProducerTransport().produce(params);
    } catch (err) {
        console.log(err)
            return
      //$txtPublish.innerHTML = 'failed';
    }
    
    document.querySelector('#my_video').srcObject = await stream;

    res.render('host')
})

module.exports = router;