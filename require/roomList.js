const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    var roomList = [];
    for(key in rooms){
        roomList.push(rooms[key].roomId);
    }
    res.json(roomList);
    //res.json({rs: rooms});
});

module.exports = router;