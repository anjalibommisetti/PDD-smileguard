const http = require('http');

function check(url) {
  return new Promise((resolve) => {
    console.log(`Checking ${url}...`);
    const req = http.get(url, (res) => {
      console.log(`✅ ${url} responded with status: ${res.statusCode}`);
      resolve(true);
    });
    req.on('error', (err) => {
      console.log(`❌ ${url} failed: ${err.message}`);
      resolve(false);
    });
    req.setTimeout(2000, () => {
      console.log(`❌ ${url} timed out`);
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  await check('http://localhost:8081/');
  await check('http://localhost:8081/node_modules/expo/AppEntry.bundle?platform=web&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable');
}

main();
