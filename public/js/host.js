
async function publish(stream, id) {
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