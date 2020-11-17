const mediasoup = require('mediasoup-client');
const socketClient = require('socket.io-client');
const socketPromise = require('./lib/socket.io-promise').promise;
const $ = document.querySelector.bind(document);

const $btnWebcam = $('#btn_webcam');
const $webcam = $('#my_video');
$btnWebcam.addEventListener('click', connect);

// async function publish(stream, id) {
//   console.log($)

//     transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
//       try {
//         const { id } = await socket.request('produce', {
//           transportId: transport.id,
//           kind,
//           rtpParameters,
//         });
//       } catch (err) {
//         errback(err);
//       }
//     });


//     try {
//       const track = stream.getVideoTracks()[0];
//       const params = { track };
      
//       producer = await transport.produce(params);
//     } catch (err) { }
// }


let device;

async function connect() {
  const socket = io();
  socket.emit('publish', $webcam.srcObject) 
}

async function loadDevice(routerRtpCapabilities) {
  try {
    device = new mediasoup.Device();
  } catch (error) {
    if (error.name === 'UnsupportedError') {
      console.error('browser not supported');
    }
  }
  await device.load({ routerRtpCapabilities });

  const data = await socket.request('createProducerTransport', {
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities,
  });
  console.log(data);
  if (data.error) {
    console.error(data.error);
    return;
  }

  const transport = device.createSendTransport(data);
  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    socket.request('connectProducerTransport', { dtlsParameters })
      .then(callback)
      .catch(errback);
  });

  transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
    try {
      const { id } = await socket.request('produce', {
        transportId: transport.id,
        kind,
        rtpParameters,
      });
      callback({ id });
    } catch (err) {
      errback(err);
    }
  });

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio : true }) 
    const track = stream.getVideoTracks()[0];
    const params = { track };
    params.encodings = [
      { maxBitrate: 100000 },
      { maxBitrate: 300000 },
      { maxBitrate: 900000 },
    ];
    params.codecOptions = {
      videoGoogleStartBitrate : 1000
    };
    producer = await transport.produce(params);
  } catch (err) {
    console.log(err)
  }
}

async function publish() {
  
}
