const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    const id = req.query.roomId
    const idx = rooms.findIndex( function(i) { return i.roomId === id } )
    rooms.splice(idx, 1)
    res.send(rooms)
});
module.exports = router