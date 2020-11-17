const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const prodId = req.query.prodId;
    const consumeId = req.query.consumeID;

    if (rooms[roomId] === undefined) { 
        res.send('CANNOT FIND')
        return 
    }  

    res.locals.rid = roomId
    res.locals.pid = prodId
    res.locals.cid = consumeId

    res.render('client')
})


router.post('/', async (req, res, _) => {
  const stream = req.body.stream
  const prodId = req.body.prodId
  const roomId = req.body.roomId
  const consumeId = req.body.consumeId

  console.log(req.body)
  if (rooms[roomId] === undefined) { 
      res.send('CANNOT FIND')
      return 
  }  

  const transport = rooms[roomId].getActiveConsumerTransport(prodId)
  const producer = await transport.produce({ stream })
  rooms[roomId].addActiveProducerToTransport(prodId, producer)
  
  res.send('comp')
})

module.exports = router;