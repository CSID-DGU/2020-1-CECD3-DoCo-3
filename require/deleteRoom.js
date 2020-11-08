const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    console.log(rooms.indexOf(req.query.roomId))
    res.send('ERASE')
});

module.exports = router