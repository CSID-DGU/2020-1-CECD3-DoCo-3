const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    var roomList = new Array();
    for(var i = 0; i < rooms.length; i++){
        console.log(rooms[i].roomId);
    }
    res.json(roomList);
    //res.json({rs: rooms});
});

module.exports = router;