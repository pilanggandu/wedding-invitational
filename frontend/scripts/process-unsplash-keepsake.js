const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const pkDir = path.resolve('frontend/public/images/paper-keepsake');
  const tmplDir = path.resolve('frontend/public/images/templates/paper-keepsake');

  console.log('Processing real photographic stock assets from Unsplash...');

  // 1. Gold Wax Seal with Embossed Botanical Monogram (Diana Light)
  const diana1Path = path.join(pkDir, 'diana-light-1.jpg');
  if (fs.existsSync(diana1Path)) {
    // Top seal is at left: 340, top: 420, width: 300, height: 300
    // Center is (150, 150), radius ~ 130px
    const sealCrop = await sharp(diana1Path)
      .extract({ left: 340, top: 420, width: 300, height: 300 })
      .toBuffer();

    const cx = 150, cy = 150;
    let d = '';
    const numPoints = 120;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      // Slightly wavy poured wax rim
      const lobe = Math.cos(angle * 5 + 0.4) * 4 + Math.sin(angle * 2) * 3;
      const r = 128 + lobe;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      d += (i === 0 ? 'M' : 'L') + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
    }
    d += 'Z';

    const svgMask = Buffer.from(`
      <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        <path d="${d}" fill="white" filter="url(#soft)" />
      </svg>
    `);

    const goldSeal = await sharp(sealCrop)
      .composite([{ input: svgMask, blend: 'dest-in' }])
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(pkDir, 'real-gold-wax-seal.png'), goldSeal);
    fs.writeFileSync(path.join(tmplDir, 'real-gold-wax-seal.png'), goldSeal);
    console.log('Saved: real-gold-wax-seal.png');
  }

  // 2. Real Pressed Lavender Specimen on Deckled Paper (Evie S.)
  const evie1Path = path.join(pkDir, 'evie-flower-1.jpg');
  if (fs.existsSync(evie1Path)) {
    const cardBuffer = await sharp(evie1Path)
      .extract({ left: 350, top: 620, width: 880, height: 1040 })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(pkDir, 'real-pressed-lavender-specimen.png'), cardBuffer);
    fs.writeFileSync(path.join(tmplDir, 'real-pressed-lavender-specimen.png'), cardBuffer);
    console.log('Saved: real-pressed-lavender-specimen.png');
  }

  // 3. Real Pressed Wildflower Botanical (Evie S.)
  const evie2Path = path.join(pkDir, 'evie-flower-2.jpg');
  if (fs.existsSync(evie2Path)) {
    const flowerBuffer = await sharp(evie2Path)
      .extract({ left: 630, top: 680, width: 620, height: 850 })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(pkDir, 'real-pressed-wildflower.png'), flowerBuffer);
    fs.writeFileSync(path.join(tmplDir, 'real-pressed-wildflower.png'), flowerBuffer);
    console.log('Saved: real-pressed-wildflower.png');
  }

  // 4. Real Eucalyptus Botanical Foliage Border
  const euca3Path = path.join(pkDir, 'unsplash-eucalyptus-3.jpg');
  if (fs.existsSync(euca3Path)) {
    const eucaBuffer = await sharp(euca3Path)
      .resize(1200, null, { fit: 'inside' })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(pkDir, 'real-eucalyptus-border.png'), eucaBuffer);
    fs.writeFileSync(path.join(tmplDir, 'real-eucalyptus-border.png'), eucaBuffer);
    console.log('Saved: real-eucalyptus-border.png');
  }

  // 5. Real Linen Tag with Threaded Eucalyptus
  const euca1Path = path.join(pkDir, 'unsplash-eucalyptus-1.jpg');
  if (fs.existsSync(euca1Path)) {
    const tagBuffer = await sharp(euca1Path)
      .extract({ left: 100, top: 60, width: 1400, height: 1000 })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(pkDir, 'real-linen-tag-eucalyptus.png'), tagBuffer);
    fs.writeFileSync(path.join(tmplDir, 'real-linen-tag-eucalyptus.png'), tagBuffer);
    console.log('Saved: real-linen-tag-eucalyptus.png');
  }

  // Clean up raw downloaded JPGs to keep workspace lean and clean
  const rawJpgs = [
    'test-diana-seal.png',
    'test-terracotta-seal.png',
    'test-evie-card.png',
    'test-evie-flower-2.png',
    'test-mask.png'
  ];
  rawJpgs.forEach(f => {
    const p = path.join(pkDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log('Stock photography assets processed and saved successfully.');
}

main().catch(console.error);
