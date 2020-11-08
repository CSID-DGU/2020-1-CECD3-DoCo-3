const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    var roomList = [];
    rooms.forEach(function(element){
        roomList.push(element.roomId);
    });
    res.json(roomList);
    //res.json({rs: rooms});
});

module.exports = router;