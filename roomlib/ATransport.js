class ActiveTransport {
    // The producer transport Id from another client that holds the producer
    transportId = null;
    transport = null;

    constructor(transport) {
      // We use the router id as the room id
        this.transportId = transport.id;
        this.transport = transport;
    }
}

module.exports = ActiveTransport;
