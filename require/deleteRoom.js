const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    console.log(typeof rooms)
    res.json({roomId: mediasoupRouter.id, rs: rooms});
});

module.exports = router;