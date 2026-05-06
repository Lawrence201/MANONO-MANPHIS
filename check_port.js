const net = require('net');

const port = 3306;
const host = 'localhost';

console.log(`Checking if ${host}:${port} is accepting connections...`);

const socket = new net.Socket();

socket.setTimeout(2000);

socket.on('connect', () => {
    console.log(`✅ SUCCESS: Port ${port} is OPEN. Database service is reachable.`);
    socket.destroy();
});

socket.on('timeout', () => {
    console.log(`❌ TIMEOUT: Could not connect to ${host}:${port} within 2s.`);
    socket.destroy();
});

socket.on('error', (err) => {
    console.log(`❌ ERROR: Could not connect to ${host}:${port}.`);
    console.log(`   Reason: ${err.message}`);
    if (err.code === 'ECONNREFUSED') {
        console.log('   👉 This means no program is listening on this port.');
        console.log('   👉 CRITICAL: Your MySQL Server is NOT running.');
    }
});

socket.connect(port, host);
