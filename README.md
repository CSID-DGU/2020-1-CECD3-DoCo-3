# WebRTC 기반 원격 화상회의 영상 송수신 성능 향상 기법

## Overview

- Host에서는 본인의 영상은 미들 서버에 Upstream을 하고 참여자들의 영상은 네트워크 환경에 따라 bit-rate를 조절하여 받음
- 참여자들은 Host의 영상만을 미들 서버에서 Downstream하고 다른 참여자들의 영상은 받지 않음

## Performance

방의 갯수는 크게 제한이 없고 1방당 test 결과 20명까지는 들어오는 것을 확인할 수 있었음

## Setting

#### Mediasoup  
    npm install mediasoup

#### Socket.io
    npm install socket.io

#### Broswerify
    npm install broswerify

## Testing

#### start node
    npm start

