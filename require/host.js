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

    res.render('host')
})


router.post('/', async (req, res, _) => {
  let form = new formidable.IncomingForm()
  console.log(req)
  console.log(form)

  // const transport = rooms[roomId].getActiveProducerTransport(prodId)
  // const producer = transport.produce({ stream })
  // rooms[roomId].addActiveProducerToTransport(prodId, producer)
})

module.exports = router;