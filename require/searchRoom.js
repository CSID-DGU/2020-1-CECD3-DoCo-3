const express = require('express');
const router = express.Router();
const Room = require('../room.js');

router.get('/', async (req, res, _) => {
    res.json(Room);
    //res.json({rs: rooms});
});

module.exports = router;