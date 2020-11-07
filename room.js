const ActiveProducerTransport = require('./models/transports/ActiveProducerTransport.js');
const ActiveConsumerTransport = require('./models/transports/ActiveConsumerTransport.js');

class Room {
    constructor(roomId, router) {
      // We use the router id as the room id
      this.roomId = roomId;
      this.routerObj = router;
      this.producerTransports = {};
      this.consumerTransports = {};
      this.consumers = {};
    }

    // Handle producer stuff below
    addActiveProducerTransport(producerTransport) {
        this.producerTransports[producerTransport.id] = new ActiveProducerTransport(producerTransport);
    }

    addActiveProducerToTransport(transportId, producer) {
        if (producer.kind === 'video') {
            this.producerTransports[transportId].addVideoProducer(producer);
        } else {
            this.producerTransports[transportId].addAudioProducer(producer);
        }
    }

    removeActiveProducerTransport(transportId) {
        this.producerTransports[transportId].transport.close();
        delete this.producerTransports[transportId];
    }

    getActiveProducerTransport(producerTransportId) {
        return this.producerTransports[producerTransportId];
    }

    getActiveProducerTransports() {
        return this.producerTransports;
    }

    // Handle consumer stuff below
    addActiveConsumerTransport(consumerTransport, associatedProducerConsumerId, parentProducerTransportId) {
        this.consumerTransports[consumerTransport.id] = new ActiveConsumerTransport(consumerTransport, associatedProducerConsumerId, parentProducerTransportId);
        this.producerTransports[parentProducerTransportId].addConsumerTransportId(associatedProducerConsumerId, consumerTransport.id);
    }

    addActiveConsumerToTransport(transportId, consumer) {
        if (consumer.kind === 'video') {
            this.consumerTransports[transportId].addVideoConsumer(consumer);
        } else {
            this.consumerTransports[transportId].addAudioConsumer(consumer);
        }
    }

    removeActiveConsumerTransport(transportId) {
        this.consumerTransports[transportId].transport.close();
        delete this.consumerTransports[transportId];
    }

    getActiveConsumerTransport(consumerTransportId) {
        return this.consumerTransports[consumerTransportId];
    }

    getActiveConsumer(consumerTransportId, kind) {
        if (kind === 'video') {
            return this.consumerTransports[consumerTransportId].videoConsumer;
        } else {
            return this.consumerTransports[consumerTransportId].audioConsumer;
        }
    }

    getActiveConsumerTransports() {
        return this.consumerTransports;
    }

    getRouter() {
        return this.routerObj;
    }
}

module.exports = Room;