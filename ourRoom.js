class Room {
    constructor(roomId, router) {
        this.roomId = roomId;
        this.hostRouterObj = router;
        this.otherRouters = {};
        this.producer;
        this.producerTransport;
        this.consumerTransport = {};
        this.consumerRooms = {}
        this.consumers = {};
        this.total = 0;
        this.isOfficial = true;
    }
}

module.exports = Room;