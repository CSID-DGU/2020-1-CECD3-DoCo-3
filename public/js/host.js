
async function publish(stream) {
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

    try {
      const track = stream.getVideoTracks()[0];
      const params = { track };
      
      producer = await transport.produce(params);
    } catch (err) { }
}