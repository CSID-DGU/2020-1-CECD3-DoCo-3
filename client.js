const mediasoup = require('mediasoup-client');
const socketClient = require('socket.io-client');
const socketPromise = require('./lib/socket.io-promise').promise;

const hostname = window.location.hostname;

let device;
let socket;
let streams = {};

const $ = document.querySelector.bind(document);
const $btnCreate = $('.CreateRoom'); //방 생성 by hoon
const $btnWebcam = $('#btn_webcam');
const $btnScreen = $('#btn_screen');
const $btnSubscribe = $('#btn_subscribe');
const $btnShare = $('#btn_share');
const $txtScreen = $('#screen_status');
const $btn_refresh = $('#btn_refresh');

if ($btnCreate) $btnCreate.addEventListener('click', create);
if ($btnWebcam) $btnWebcam.addEventListener('click', connect);
if ($btnSubscribe) $btnSubscribe.addEventListener('click', connect);
if ($btnShare) $btnShare.addEventListener('click', publish);
if ($btn_refresh) $btn_refresh.addEventListener('click', addConsumer);

if (typeof navigator.mediaDevices.getDisplayMedia === 'undefined') {
  $txtScreen.innerHTML = 'Not supported';
  $btnScreen.disabled = true;
}

function create() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() { // 요청에 대한 콜백
      if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
        if (xhr.status === 200 || xhr.status === 201) {
          const Room = JSON.parse(xhr.responseText);

          sessionStorage.setItem('ROOMID', Room.roomId);
          sessionStorage.setItem('ISHOST', true);
          location.href = `http://docoex.page/host.html?${sessionStorage.getItem('ROOMID')}`; //방 이동          
        } else {
          console.error(xhr.responseText);
       }
    }
  };
  xhr.open('GET', 'https://docoex.page/createRoom'); // 메소드와 주소 설정
  xhr.send(); // 요청 전 
}

async function connect() {
  const opts = {
    path: '/server',
    transports: ['websocket'],
  };

  const serverUrl = `https://${hostname}`;
  socket = socketClient(serverUrl, opts);
  socket.request = socketPromise(socket);

  socket.on('connect', async () => {
    const data = await socket.request('getRouterRtpCapabilities', { roomId : sessionStorage.getItem('ROOMID') });
    await loadDevice(data);
    if (sessionStorage.getItem('ISHOST')) publish()
    else subscribe_b()
  });

  socket.on('disconnect', () => { });
  socket.on('connect_error', (error) => { console.error('could not connect to %s%s (%s)', serverUrl, opts.path, error.message); });
  socket.on('newProducer', () => { });
  socket.on('newCProducer', () => { });
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

async function publish() {
  const data = await socket.request('createProducerTransport', {
    roomId : sessionStorage.getItem('CLIENTID') ? sessionStorage.getItem('CLIENTID') : sessionStorage.getItem('ROOMID'),
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities,
  });
  if (data.error) {
    console.error(data.error);
    return;
  }

  const transport = device.createSendTransport(data);
  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    socket.request('connectProducerTransport', {  
      roomId : sessionStorage.getItem('CLIENTID') ? sessionStorage.getItem('CLIENTID') : sessionStorage.getItem('ROOMID'),
      dtlsParameters })
      .then(callback)
      .catch(errback);
  });

  transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
    try {
      const { id } = await socket.request('produce', {
        roomId : sessionStorage.getItem('CLIENTID') ? sessionStorage.getItem('CLIENTID') : sessionStorage.getItem('ROOMID'),
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
      case 'connected':
        document.querySelector('#local_video').srcObject = stream;
      break;

      case 'failed':
        transport.close();
      break;

      default: break;
    }
  });

  let stream;
  try {
    stream = await getUserMedia();
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
        if (data.exists) {
          sessionStorage.setItem('CLIENTID', data.clientId);
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
  const data = await socket.request('createConsumerTransport', {
    roomId : sessionStorage.getItem('ROOMID'),
    cId : sessionStorage.getItem('CLIENTID'),
    forceTcp: false,
  });

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
      case 'connected':
        document.querySelector('#remote_video').srcObject = await stream;
        await socket.request('resume');
        break;

      case 'failed':
        transport.close();
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

async function subscribeh(cid, cnt) {
  const data = await socket.request('createConsumerTransport', {
    roomId : cid,
    cId : sessionStorage.getItem('ROOMID'),
    forceTcp: false,
  });

  if (data.error) {
    console.error(data.error);
    return;
  }

  const transport = device.createRecvTransport(data);
  transport.on('connect', ({ dtlsParameters }, callback, errback) => {
    socket.request('connectConsumerTransport', {
      roomId : cid,
      cId : sessionStorage.getItem('ROOMID'),
      transportId: transport.id,
      dtlsParameters
    })
      .then(callback)
      .catch(errback);
  });

  transport.on('connectionstatechange', async (state) => {
    switch (state) {
      case 'connected':
        document.getElementById('remote_video_' + cnt).srcObject = await streams[cid];
        await socket.request('resume');
        break;

      case 'failed':
        transport.close();
        break;

      default: break;
    }
  });

  streams[cid] = consumeh(cid, transport);
}


async function consumeh(cid, transport) {
  const { rtpCapabilities } = device;
  const data = await socket.request('consume', { roomId : cid, cId : sessionStorage.getItem('ROOMID'), rtpCapabilities });
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

async function addConsumer() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() { // 요청에 대한 콜백
      if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
        if (xhr.status === 200 || xhr.status === 201) {
          const Room = JSON.parse(xhr.responseText);
          for (r in Room) {
            if (Room[r] === sessionStorage.getItem('ROOMID')) continue
            if (streams[Room[r]]) continue

            subscribeh(Room[r], (r - 1))
            console.log(r - 1)
            break
          }
        } else {
          console.error(xhr.responseText);
       }
    }
  };
  xhr.open('GET', 'https://docoex.page/roomClients?roomId='+sessionStorage.getItem('ROOMID')); // 메소드와 주소 설정
  xhr.send(); // 요청 전 
}