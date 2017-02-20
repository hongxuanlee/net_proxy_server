'use strict';

let net = require('net');

let server = net.createServer((c) => {
    console.log('client connected');

    console.log(c.localAddress, c.localPort,
        c.remoteAddress, c.remotePort);

    c.on('end', () => {
        console.log('client disconnected');
    });

    c.on('data', (chunk) => {
        
        console.log('----------data----------');
        //console.log(chunk.toString('utf-8'));
        console.log(chunk);
        c.write('7');
    });

    c.write('7');
    
});

server.on('error', (err) => {
    console.log(err);
});

server.listen(8124, () => {
    console.log('server bound at 8124');
});
