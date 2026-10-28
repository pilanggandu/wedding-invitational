const https = require('https');

function searchUnsplash(query, count = 5) {
  return new Promise((resolve, reject) => {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const waxSeals = await searchUnsplash('wax seal wedding flatlay', 6);
  console.log('--- WAX SEALS ---');
  waxSeals.forEach((r, i) => {
    console.log(`${i+1}. [${r.id}] ${r.alt_description} -> ${r.urls.raw}&w=1200&q=80`);
  });

  const pressedFlowers = await searchUnsplash('pressed flowers herbarium', 6);
  console.log('\n--- PRESSED FLOWERS ---');
  pressedFlowers.forEach((r, i) => {
    console.log(`${i+1}. [${r.id}] ${r.alt_description} -> ${r.urls.raw}&w=1200&q=80`);
  });

  const weddingStationery = await searchUnsplash('wedding stationery deckle edge paper', 6);
  console.log('\n--- WEDDING STATIONERY ---');
  weddingStationery.forEach((r, i) => {
    console.log(`${i+1}. [${r.id}] ${r.alt_description} -> ${r.urls.raw}&w=1200&q=80`);
  });
}

main().catch(console.error);
