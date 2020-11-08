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


router.post('/', (req, res, _) => {
  let form = new formidable.IncomingForm()
  form.parse(req, function(err, fields, files) {
    console.log(fields.name)
  });

  form.on('end', function(fields, files) {
    console.log(files)
    console.log(fields)
  });

  // const transport = rooms[roomId].getActiveProducerTransport(prodId)
  // const producer = transport.produce({ stream })
  // rooms[roomId].addActiveProducerToTransport(prodId, producer)
  
  res.send('comp')
})

module.exports = router;