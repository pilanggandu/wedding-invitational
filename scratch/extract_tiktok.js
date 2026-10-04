const https = require('https');

const options = {
  hostname: 'www.tiktok.com',
  path: '/@satucerita.invitation/video/7692416356267937045',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
  }
};

https.get(options, (res) => {
  let chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const data = Buffer.concat(chunks).toString('utf-8');
    const startTag = '<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">';
    const startIdx = data.indexOf(startTag);
    if (startIdx !== -1) {
      const endIdx = data.indexOf('</script>', startIdx);
      const jsonStr = data.substring(startIdx + startTag.length, endIdx);
      try {
        const json = JSON.parse(jsonStr);
        const item = json['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.['itemInfo']?.['itemStruct'];
        console.log('DESC:', item?.desc);
        console.log('PLAYADDR:', item?.video?.playAddr);
        console.log('COVER:', item?.video?.cover);
        console.log('DYNAMIC_COVER:', item?.video?.dynamicCover);
        if (item?.video?.playAddr) {
          require('fs').writeFileSync('scratch/play_url.txt', item.video.playAddr);
        }
      } catch (e) {
        console.log('Error parsing JSON:', e.message);
      }
    } else {
      console.log('No script tag found, length of data:', data.length);
    }
  });
}).on('error', err => console.error(err));
