const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    var roomList = [];
    Array.prototype.forEach.call(rooms, function(e1) {
        roomList.push(e1.roomId);
    })
    res.json(roomList);
    //res.json({rs: rooms});
});

module.exports = router;