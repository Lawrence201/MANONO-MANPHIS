const QRCode = require('qrcode');
const path = require('path');

const url = 'https://www.campelimafrica.com/social';
const outputPath = path.join(__dirname, '..', 'public', 'social-qrcode.png');

// Generate high-resolution QR code (1024x1024)
QRCode.toFile(outputPath, url, {
    type: 'png',
    width: 1024,
    margin: 2,
    color: {
        dark: '#000000',
        light: '#FFFFFF'
    }
}, function (err) {
    if (err) {
        console.error('Error generating QR code:', err);
        process.exit(1);
    }
    console.log('✅ QR Code generated successfully!');
    console.log('📍 Saved to:', outputPath);
    console.log('🔗 URL embedded:', url);
});
