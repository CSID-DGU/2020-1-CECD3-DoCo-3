const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    const id = req.query.roomId
    console.log(id + typeof(rooms));
    res.send('ERASE')
});
module.exports = router