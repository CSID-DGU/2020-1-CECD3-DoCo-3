const mediasoup = require('mediasoup-client');
const socketClient = require('socket.io-client');
const socketPromise = require('./lib/socket.io-promise').promise;
const $ = document.querySelector.bind(document);

const $btnWebcam = $('#btn_webcam');
$btnWebcam.addEventListener('click', publish);

async function publish(stream, id) {
  console.log($)

    transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { id } = await socket.request('produce', {
          transportId: transport.id,
          kind,
          rtpParameters,
        });
      } catch (err) {
        errback(err);
      }
    });


    try {
      const track = stream.getVideoTracks()[0];
      const params = { track };
      
      producer = await transport.produce(params);
    } catch (err) { }
}