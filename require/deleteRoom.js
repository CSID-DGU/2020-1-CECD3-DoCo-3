const express = require('express');
const router = express.Router();

router.get('/', async (req, res, _) => {
    const roomId = req.query.roomId;
    //rooms.delete(roomId);
    console.log('ageg');
    res.json({roomId: mediasoupRouter.id, rs: rooms});
});

module.exports = router;