class Room {
    constructor(roomId) {
        this.roomId = roomId;
        this.hostRouterObj = {};
        this.producer;
        this.producerTransport = {};
        this.consumerTransport = {};
        this.consumers = {};
        this.total = 0;
    }
}

module.exports = Room;