const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    var roomList = [];
    for(key in rooms){
        roomList.push(key.key)
    }
    res.json(roomList);
});

module.exports = router;