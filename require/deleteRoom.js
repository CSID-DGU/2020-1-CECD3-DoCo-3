const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    const id = req.query.roomId
    rooms.erase(id);
    rooms.splice(idx, 1)
    res.send(rooms)
});
module.exports = router