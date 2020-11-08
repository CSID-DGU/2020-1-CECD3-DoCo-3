const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    res.json(rooms);
    //res.json({rs: rooms});
});

module.exports = router;