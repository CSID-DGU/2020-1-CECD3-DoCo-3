const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    var roomList = [];
    for(key in rooms){
        roomList.push(key.roomId)
    }
    
    res.json(roomList);
});

module.exports = router;