const fetch = require('node-fetch');

async function testApi(url) {
    console.log(`Testing ${url}...`);
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
        if (text.startsWith('<!DOCTYPE')) {
            console.log('Error: Received HTML instead of JSON');
            console.log('Snippet:', text.substring(0, 500));
        } else {
            try {
                const json = JSON.parse(text);
                console.log('Success: Received valid JSON');
            } catch (e) {
                console.log('Error: Failed to parse JSON');
                console.log('Body:', text.substring(0, 200));
            }
        }
    } catch (error) {
        console.error(`Fetch failed: ${error.message}`);
    }
    console.log('------------------');
}

async function runTests() {
    const baseUrl = 'http://localhost:3000';
    await testApi(`${baseUrl}/api/admin/occupancy`);
    await testApi(`${baseUrl}/api/admin/stats`);
    await testApi(`${baseUrl}/api/admin/chart-data`);
}

runTests();
