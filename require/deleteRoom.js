const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    rooms.remove(roomId);
    res.send('ERASE')
});

module.exports = router;