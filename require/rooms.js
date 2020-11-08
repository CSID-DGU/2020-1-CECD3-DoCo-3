const mediasoup = require("mediasoup");
const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    const data = rooms[roomId].getRouter().rtpCapabilities
    res.locals.stream = data
    //res.status(200).json(data)
    res.render('r')
})

module.exports = router;