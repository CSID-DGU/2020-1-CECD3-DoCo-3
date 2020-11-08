const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const prodId = req.query.prodId;
  
    if (rooms[roomId] === undefined) { 
        res.send('CANNOT FIND')
        return 
    }  

    res.locals.rid = roomId
    res.locals.pid = prodId

    res.render('host')
})


router.post('/', async (req, res, _) => {
  const stream = res.body.stream
  const prodId = res.body.prodId
  const roomId = res.body.roomId


  console.log(res.body)
  if (rooms[roomId] === undefined) { 
      res.send('CANNOT FIND')
      return 
  }  

  const transport = rooms[roomId].getActiveProducerTransport(prodId)
  const producer = await transport.produce({ stream })
  rooms[roomId].addActiveProducerToTransport(prodId, producer)
  
  res.send('comp')
})

module.exports = router;