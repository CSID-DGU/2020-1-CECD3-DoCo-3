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

    res.locals.rid = roomId

    // try {
    //   const track = stream.getVideoTracks()[0];
    //   const params = { track };
    //   params.codecOptions = {
    //     videoGoogleStartBitrate : 1000
    //   };
      
    //   //producer = await transport.produce(params);
    // } catch (err) {
    //     console.log(err)
    //         return
    //   //$txtPublish.innerHTML = 'failed';
    // }
    
    // //document.querySelector('#my_video').srcObject = await stream;
    // res.locals.stream = stream;
    res.render('host')
})

module.exports = router;