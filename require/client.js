const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    //const roomId = req.query.roomId;
    //const currentRoom = rooms[roomId]

    res.render('client')
})

module.exports = router;