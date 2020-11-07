const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const roomId = req.query.roomId;
    // console.log(req.query);
    res.json({ exists: roomId in rooms });
    res.send('complete')
});

module.exports = router;