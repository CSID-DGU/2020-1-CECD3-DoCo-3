const ActiveTransport = require('./ATransport.js');

class ActiveConsumerTransport extends ActiveTransport {
    parentProducerTransportId = null;

    // The producer transportId that is requesting this consumer transport
    associatedClientId = null;

    videoConsumer = null;

    audioConsumer = null;

    constructor(consumerTransport, associatedClientId, parentProducerTransportId) {
      // We use the router id as the room id
      super(consumerTransport);
      this.parentProducerTransportId = parentProducerTransportId;
      this.associatedClientId = associatedClientId;
    }

    addVideoConsumer(videoConsumer) {
        this.videoConsumer = videoConsumer;
        this.videoConsumer.on("transportclose", () => {
            this.videoConsumer.close();
            console.log("Closing Video Consumer in Consumer Transport " + this.transportId + "!");
        });
        
    }

    addAudioConsumer(audioConsumer) {
        this.audioConsumer = audioConsumer;
        this.audioConsumer.on("transportclose", () => {
            this.audioConsumer.close();
            console.log("Closing Audio Consumer in Consumer Transport " + this.transportId + "!");
        });
    }
}

module.exports = ActiveConsumerTransport;
