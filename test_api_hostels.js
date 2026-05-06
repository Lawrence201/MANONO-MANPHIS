// Test script to call /api/hostels endpoint
const fetch = require('node-fetch');

async function testHostelsAPI() {
    try {
        console.log('Testing /api/hostels endpoint...');
        const response = await fetch('http://localhost:3000/api/hostels');

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        const data = await response.json();

        if (response.ok) {
            console.log('Success! Fetched', data.length, 'hostels');
            if (data.length > 0) {
                console.log('First hostel:', data[0].name);
            }
        } else {
            console.log('ERROR Response body:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

testHostelsAPI();
