const ActiveTransport = require('./ATransport.js');

class ActiveProducerTransport extends ActiveTransport {
    // Stores hashmap of 'destination producer transport id' -> 'destination consumer transport id'
    childTransportIds = null;

    videoProducer = null;

    audioProducer = null;

    constructor(producerTransport) {
        super(producerTransport);
        this.childTransportIds = {};
    }

    addConsumerTransportId(associatedProducerTransportId, consumerTransportId) {
        this.childTransportIds[associatedProducerTransportId] = consumerTransportId;
    }

    addVideoProducer(videoProducer) {
        this.videoProducer = videoProducer;
        this.videoProducer.on("transportclose", () => {
            this.videoProducer.close();
            console.log("Closing Video Producer in Producer Transport " + this.transportId + "!");
        });  
    }

    addAudioProducer(audioProducer) {
        this.audioProducer = audioProducer;
        this.audioProducer.on("transportclose", () => {
            this.audioProducer.close();
            console.log("Closing Audio Producer in Producer Transport " + this.transportId + "!");
        });   
    } 
}

module.exports = ActiveProducerTransport;
