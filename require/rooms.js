const express = require('express');
const router = express.Router();
const Room = require('./room.js');

router.post('/', async (req, res, next) => {
    const roomId = req.query.roomId;
    const data = rooms[roomId].getRouter().rtpCapabilities
    //res.status(200).json(data)
    res.render('index.html');
})

module.exports = router;