
const shortUrl = 'https://maps.app.goo.gl/mrwqveooNVvNjUcu8';

async function resolve() {
  try {
    const response = await fetch(shortUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('Final URL:', response.url);
  } catch (error) {
    console.error('Error:', error);
  }
}

resolve();
