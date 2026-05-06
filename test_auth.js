
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/session',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('BODY:');
    console.log(body.substring(0, 500)); // Print first 500 chars
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
