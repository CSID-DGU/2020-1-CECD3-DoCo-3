const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    rooms.delete(req.query.roomId);
    res.send('ERASE')
});

module.exports = router;