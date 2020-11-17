class Room {
    constructor(roomId, router) {
        this.roomId = roomId;
        this.hostRouterObj = router;
        this.otherRouters = [];
        this.producerTransports = {};
        this.consumerTransports = {};
        this.consumers = {};
    }
}