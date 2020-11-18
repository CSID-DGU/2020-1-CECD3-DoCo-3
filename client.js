const mediasoup = require('mediasoup-client');
const socketClient = require('socket.io-client');
const socketPromise = require('./lib/socket.io-promise').promise;

const hostname = window.location.hostname;

let device;
let socket;
let producer;

const $ = document.querySelector.bind(document);
const $fsPublish = $('#fs_publish');
const $fsSubscribe = $('#fs_subscribe');
const $btnConnect = $('#btn_connect');
const $btnCreate = $('.CreateRoom'); //방 생성 by hoon
const $btnWebcam = $('#btn_webcam');
const $btnScreen = $('#btn_screen');
const $btnSubscribe = $('#btn_subscribe');
const $btnShare = $('#btn_share');
const $btnList = $('#btn_list');
const $txtConnection = $('#connection_status');
const $txtWebcam = $('#webcam_status');
const $txtScreen = $('#screen_status');
const $txtSubscription = $('#sub_status');
let $txtPublish;



if ($btnCreate) $btnCreate.addEventListener('click', create);
if ($btnWebcam) $btnWebcam.addEventListener('click', publish);
if ($btnSubscribe) $btnSubscribe.addEventListener('click', subscribe_b);
if ($btnList) $btnList.addEventListener('click', initialize);
if ($btnShare) $btnShare.addEventListener('click', publish_c);

if (typeof navigator.mediaDevices.getDisplayMedia === 'undefined') {
  $txtScreen.innerHTML = 'Not supported';
  $btnScreen.disabled = true;
}

function initialize() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() { // 요청에 대한 콜백
      if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
        if (xhr.status === 200 || xhr.status === 201) {
          const Room = JSON.parse(xhr.responseText);
          sessionStorage.setItem('ROOMID', Room[0]);
          sessionStorage.setItem('ISHOST', true);
          console.log(sessionStorage.getItem('ROOMID'))
        } else {
          console.error(xhr.responseText);
       }
    }
  };
  xhr.open('GET', 'https://docoex.page/roomList'); // 메소드와 주소 설정
  xhr.send();
}

function create() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() { // 요청에 대한 콜백
      if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
        if (xhr.status === 200 || xhr.status === 201) {
          const Room = JSON.parse(xhr.responseText);
          console.log(Room.roomId)

          sessionStorage.setItem('ROOMID', Room.roomId);
          location.href = `http://docoex.page/host.html?${Room.roomId}`; //방 이동
          connect()
        } else {
          console.error(xhr.responseText);
       }
    }
  };
  xhr.open('GET', 'https://docoex.page/createRoom'); // 메소드와 주소 설정
  xhr.send(); // 요청 전 
}

async function connect() {
  $btnConnect.disabled = true;
  $txtConnection.innerHTML = 'Connecting...';

  const opts = {
    path: '/server',
    transports: ['websocket'],
  };

  const serverUrl = `https://${hostname}`;
  socket = socketClient(serverUrl, opts);
  socket.request = socketPromise(socket);

  socket.on('connect', async () => {
    $txtConnection.innerHTML = 'Connected';
    $fsPublish.disabled = false;
    $fsSubscribe.disabled = false;

    const data = await socket.request('getRouterRtpCapabilities', { roomId : sessionStorage.getItem('ROOMID') });
    await loadDevice(data);
  });

  socket.on('disconnect', () => {
    $txtConnection.innerHTML = 'Disconnected';
    $btnConnect.disabled = false;
    $fsPublish.disabled = true;
    $fsSubscribe.disabled = true;
  });

  socket.on('connect_error', (error) => {
    console.error('could not connect to %s%s (%s)', serverUrl, opts.path, error.message);
    $txtConnection.innerHTML = 'Connection failed';
    $btnConnect.disabled = false;
  });

  socket.on('newProducer', () => {
    $fsSubscribe.disabled = false;
  });

  socket.on('newCProducer', () => {
    $fsSubscribe.disabled = false;
  });
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
}

async function publish(e) {
  const isWebcam = (e.target.id === 'btn_webcam');
  $txtPublish = isWebcam ? $txtWebcam : $txtScreen;

  const data = await socket.request('createProducerTransport', {
    roomId : sessionStorage.getItem('ROOMID'),
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities,
  });
  if (data.error) {
    console.error(data.error);
    return;
  }

  const transport = device.createSendTransport(data);
  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    socket.request('connectProducerTransport', { roomId : sessionStorage.getItem('ROOMID'), dtlsParameters })
      .then(callback)
      .catch(errback);
  });

  transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
    try {
      const { id } = await socket.request('produce', {
        roomId : sessionStorage.getItem('ROOMID'),
        transportId: transport.id,
        kind,
        rtpParameters,
      });
      callback({ id });
    } catch (err) {
      errback(err);
    }
  });

  transport.on('connectionstatechange', (state) => {
    switch (state) {
      case 'connecting':
        $txtPublish.innerHTML = 'publishing...';
        $fsPublish.disabled = true;
        $fsSubscribe.disabled = true;
      break;

      case 'connected':
        document.querySelector('#local_video').srcObject = stream;
        $txtPublish.innerHTML = 'published';
        $fsPublish.disabled = true;
        $fsSubscribe.disabled = false;
      break;

      case 'failed':
        transport.close();
        $txtPublish.innerHTML = 'failed';
        $fsPublish.disabled = false;
        $fsSubscribe.disabled = true;
      break;

      default: break;
    }
  });

  let stream;
  try {
    stream = await getUserMedia(transport, isWebcam);
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
    $txtPublish.innerHTML = 'failed';
  }
}


async function publish_c(e) {
  const isWebcam = (e.target.id === 'btn_webcam');
  $txtPublish = isWebcam ? $txtWebcam : $txtScreen;

  const data = await socket.request('createConsumerTransport', {
    roomId : sessionStorage.getItem('ROOMID'),
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities,
  });

  if (data.error) {
    console.error(data.error);
    return;
  }

  const transport = device.createSendTransport(data);
  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    socket.request('connectConsumerTransport', { roomId : sessionStorage.getItem('ROOMID'), 
                                                 cId : sessionStorage.getItem('CLIENTID'), dtlsParameters })
      .then(callback)
      .catch(errback);
  });

  transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
    try {
      const { id } = await socket.request('clientproduce', {
        roomId : sessionStorage.getItem('ROOMID'),
        cId : sessionStorage.getItem('CLIENTID'),
        transportId: transport.id,
        kind,
        rtpParameters,
      });
      callback({ id });
    } catch (err) {
      errback(err);
    }
  });

  transport.on('connectionstatechange', (state) => {
    switch (state) {
      case 'connecting':
        $fsPublish.disabled = true;
        $fsSubscribe.disabled = true;
      break;

      case 'connected':
        document.querySelector('#local_video').srcObject = stream;
        $fsPublish.disabled = true;
        $fsSubscribe.disabled = false;
      break;

      case 'failed':
        transport.close();
        $fsPublish.disabled = false;
        $fsSubscribe.disabled = true;
      break;

      default: break;
    }
  });

  let stream;
  try {
    stream = await getUserMedia(transport, isWebcam);
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

async function getUserMedia() {
  if (!device.canProduce('video')) {
    console.error('cannot produce video');
    return;
  }

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  } catch (err) {
    console.error('getUserMedia() failed:', err.message);
    throw err;
  }
  return stream;
}

function subscribe_b() {
  if (!sessionStorage.getItem('CLIENTID')) {
    const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() { // 요청에 대한 콜백
      if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
      if (xhr.status === 200 || xhr.status === 201) {
        const data = JSON.parse(xhr.responseText);
        console.log(data.clientId)
        if (data.exists) {
          sessionStorage.setItem('CLIENTID', data.clientId);
          console.log('subscribe')
          subscribe();
        }
      } else {
        console.error(xhr.responseText);
      }
    }
    };
    xhr.open('GET', 'https://docoex.page/roomExists?roomId='+sessionStorage.getItem('ROOMID')); // 메소드와 주소 설정
    xhr.send(); // 요청 전송 
  } else {
    subscribe();
  }
}

async function subscribe() {
  console.log(sessionStorage.getItem('CLIENTID'))
  const data = await socket.request('createConsumerTransport', {
    roomId : sessionStorage.getItem('ROOMID'),
    cId : sessionStorage.getItem('CLIENTID'),
    forceTcp: false,
  });

  console.log(data)
  if (data.error) {
    console.error(data.error);
    return;
  }

  const transport = device.createRecvTransport(data);
  transport.on('connect', ({ dtlsParameters }, callback, errback) => {
    socket.request('connectConsumerTransport', {
      roomId : sessionStorage.getItem('ROOMID'),
      cId : sessionStorage.getItem('CLIENTID'),
      transportId: transport.id,
      dtlsParameters
    })
      .then(callback)
      .catch(errback);
  });

  transport.on('connectionstatechange', async (state) => {
    switch (state) {
      case 'connecting':
        $txtSubscription.innerHTML = 'subscribing...';
        $fsSubscribe.disabled = true;
        break;

      case 'connected':
        document.querySelector('#remote_video').srcObject = await stream;
        await socket.request('resume');
        $txtSubscription.innerHTML = 'subscribed';
        $fsSubscribe.disabled = true;
        break;

      case 'failed':
        transport.close();
        $txtSubscription.innerHTML = 'failed';
        $fsSubscribe.disabled = false;
        break;

      default: break;
    }
  });

  const stream = consume(transport);
}

async function consume(transport) {
  const { rtpCapabilities } = device;
  const data = await socket.request('consume', { roomId : sessionStorage.getItem('ROOMID'), cId : sessionStorage.getItem('CLIENTID'), rtpCapabilities });
  const {
    producerId,
    id,
    kind,
    rtpParameters,
  } = data;

  let codecOptions = {};
  const consumer = await transport.consume({
    id,
    producerId,
    kind,
    rtpParameters,
    codecOptions,
  });
  const stream = new MediaStream();
  stream.addTrack(consumer.track);
  return stream;
}
