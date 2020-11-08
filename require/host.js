const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const currentRoom = rooms[roomId]
    if (currentRoom === undefined) { 
        res.send('CANNOT FIND')
        return 
    }  

    try {
      
      const track = clientStream.getVideoTracks()[0];
      const params = { track };
        params.codecOptions = {
          videoGoogleStartBitrate : 1000
      }
      producer = await currentRoom.getActiveProducerTransport().produce(params);
    } catch (err) {
        console.log(err)
            return
      //$txtPublish.innerHTML = 'failed';
    }
    
    

    res.render('host')
})

module.exports = router;