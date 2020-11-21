class Room {
    constructor(roomId, router) {
        this.roomId = roomId;
        this.hostRouterObj = router;
        this.otherRouters = {};
        this.producer;
        this.producerTransport;
        this.consumerTransport = {};
        this.consumers = {};
    }
}

module.exports = Room;