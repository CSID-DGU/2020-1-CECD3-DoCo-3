const express = require('express');
const router = express.Router();
const Room = require('../room.js');
const formidable = require('formidable')

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const prodId = req.query.prodId;
  
    if (rooms[roomId] === undefined) { 
        res.send('CANNOT FIND')
        return 
    }  

    res.locals.rid = roomId
    res.locals.pid = prodId

    console.log(rooms[roomId].getActiveProducerTransport(prodId).produceData())

    res.render('host')
})


router.post('/', async (req, res, _) => {
  let form = new formidable.IncomingForm()
  console.log(req)
  console.log(form)

  try {
      
    const track = req.getVideoTracks()[0];
    const params = { track };
      params.codecOptions = {
        videoGoogleStartBitrate : 1000
    }

    console.log(track)
    producer = await currentRoom.getActiveProducerTransport().produce(params);
  } catch (err) {
      console.log(err)
          return
    //$txtPublish.innerHTML = 'failed';
  }
  // const transport = rooms[roomId].getActiveProducerTransport(prodId)
  // const producer = transport.produce({ stream })
  // rooms[roomId].addActiveProducerToTransport(prodId, producer)
})

module.exports = router;