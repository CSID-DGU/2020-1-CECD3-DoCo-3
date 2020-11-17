const express = require('express');
const router = express.Router();
const socketPromise = require('../lib/socket.io-promise').promise;

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

module.exports = router;