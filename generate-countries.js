const fs = require('fs');

const codes = ["BD","BE","BF","BG","BA","BN","BO","JP","BI","BJ","BT","JM","BW","BR","BS","BY","BZ","RU","RW","RS","LT","LU","LR","RO","GW","GT","GR","GQ","GY","GE","GB","GA","GN","GM","GL","KW","GH","OM","JO","HR","HT","HU","HN","PR","PS","PT","PY","PA","PG","PE","PK","PH","PL","ZM","EH","EE","EG","ZA","EC","AL","AO","KZ","ET","ZW","ES","ER","ME","MD","MG","MA","UZ","MM","ML","MN","MK","MW","MR","UG","MY","MX","VU","FR","FI","FJ","FK","NI","NL","NO","NA","NC","NE","NG","NZ","NP","CI","CH","CO","CN","CM","CL","CA","CG","CF","CD","CZ","CY","CR","CU","SZ","SY","KG","KE","SS","SR","KH","SV","SK","KR","SI","KP","SO","SN","SL","SB","SA","SE","SD","DO","DJ","DK","DE","YE","AT","DZ","US","LV","UY","LB","LA","TW","TT","TR","LK","TN","TL","TM","TJ","LS","TH","TF","TG","TD","LY","AE","VE","AF","IQ","IS","IR","AM","IT","VN","AR","AU","IL","IN","TZ","AZ","IE","ID","UA","QA","MZ"];

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

const list = codes.map(code => ({
  code,
  name: regionNames.of(code)
})).sort((a, b) => a.name.localeCompare(b.name));

const fileContent = `export const mapCountries = ${JSON.stringify(list, null, 2)};\n`;

fs.writeFileSync('src/lib/countries.ts', fileContent);
console.log("Countries file generated.");
