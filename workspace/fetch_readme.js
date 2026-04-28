import fs from 'fs';
import https from 'https';

https.get('https://raw.githubusercontent.com/omergocmen/vibe-coder-kit/main/README.md', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    console.log(data);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
