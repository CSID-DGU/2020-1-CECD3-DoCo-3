const express = require('express');
const router = express.Router();
const Room = require('../room.js');
const getUserMedia = require('getusermedia');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }  
    
    let stream;


    try {
      stream = await getUserMedia(function (err, stream) {
        // if the browser doesn't support user media
        // or the user says "no" the error gets passed
        // as the first argument.
        if (err) {
           console.log('failed');
        } else {
           console.log('got a stream', stream);  
        }
    });
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