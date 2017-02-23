'use strict';

let net = require('net');
let remain = 0;
let remainData = '';

let server = net.createServer((c) => {
  console.log('client connected');

  console.log(c.localAddress, c.localPort,
    c.remoteAddress, c.remotePort);

  c.on('end', () => {
    console.log('client disconnected');
  });

  c.on('data', (chunk) => {
    console.log('----------data----------');
    console.log(chunk);
    if (remain === 0) {
      let len = chunk.slice(0, 4).readInt32LE();
      console.log(len);
      let str = chunk.slice(4);
      console.log(str);
      handleBuffer(str, len - 4, c);
    } else {
      let str = remainData + chunk;
      handleBuffer(str, remain, c);
    }
  });
});

function handleBuffer(chunk, totalLen, c) {
  let chunkLen = chunk.length
  console.log(chunkLen);
  if (totalLen - chunkLen === 0) {
    let data = JSON.parse(chunk.toString('ascii'));
    console.log('receive message:')
    console.log(data);
    handleMessage(data, c);
  } else {
    remainData = chunk;
    remain = totalLen
  }
}

function handleMessage(data, c) {
  const buf = Buffer.allocUnsafe(4);
  if (data.command === 6) {
    let str = JSON.stringify({
      'command': 7,
      'result-code': 0,
      'identifier': data.identifier
    });
    let buStr = Buffer.from(str, 'utf-8')
    console.log(buStr);
    buf.writeInt32LE(buStr.length + 4, 0);
    let message = Buffer.concat([buf, buStr]);
    console.log('send message:');
    console.log(message);
    c.write(message);
  }
}

server.on('error', (err) => {
  console.log(err);
});

server.listen(8124, () => {
  console.log('server bound at 8124');
});
