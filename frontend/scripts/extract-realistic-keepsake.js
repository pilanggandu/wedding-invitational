const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const heroPath = path.resolve('frontend/public/images/paper-keepsake/hero-paper-keepsake.png');
  const outDir = path.resolve('frontend/public/images/paper-keepsake');
  const templateDir = path.resolve('frontend/public/images/templates/paper-keepsake');

  console.log('Generating authentic photographic keepsake assets...');

  // 1. Authentic Wax Seal
  // Center is at (578, 1089) in hero-paper-keepsake.png
  const sealCrop = await sharp(heroPath)
    .extract({ left: 478, top: 989, width: 200, height: 200 })
    .toBuffer();

  // 13 control points tracing the exact organic poured wax rim in 200x200 crop
  const pts = [
    [100, 27],
    [130, 30],
    [158, 48],
    [174, 78],
    [177, 114],
    [167, 146],
    [142, 172],
    [100, 178],
    [64, 168],
    [46, 142],
    [44, 108],
    [50, 70],
    [72, 42]
  ];

  let d = `M ${pts[0][0]} ${pts[0][1]} `;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0]} ${p2[1]} `;
  }
  d += 'Z';

  const svgMask = Buffer.from(`
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softEdge" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>
      <path d="${d}" fill="white" filter="url(#softEdge)" />
    </svg>
  `);

  const waxSealBuffer = await sharp(sealCrop)
    .composite([{ input: svgMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'wax-seal-authentic.png'), waxSealBuffer);
  fs.writeFileSync(path.join(templateDir, 'wax-seal-authentic.png'), waxSealBuffer);
  console.log('Saved: wax-seal-authentic.png');

  // 2. Authentic Pressed Hydrangea & Dried Floral Bouquet
  // In hero-paper-keepsake.png, bottom-left floral bunch with washi tape
  // Left: 20, Top: 390, Width: 420, Height: 750
  const flowerCrop = await sharp(heroPath)
    .extract({ left: 20, top: 390, width: 420, height: 750 })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'pressed-hydrangea-bouquet.png'), flowerCrop);
  fs.writeFileSync(path.join(templateDir, 'pressed-hydrangea-bouquet.png'), flowerCrop);
  console.log('Saved: pressed-hydrangea-bouquet.png');

  // 3. Authentic Dried Botanical Sprig (Top Right)
  // Left: 650, Top: 15, Width: 450, Height: 480
  const sprigCrop = await sharp(heroPath)
    .extract({ left: 650, top: 15, width: 450, height: 480 })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'botanical-dried-sprig.png'), sprigCrop);
  fs.writeFileSync(path.join(templateDir, 'botanical-dried-sprig.png'), sprigCrop);
  console.log('Saved: botanical-dried-sprig.png');

  // 4. Authentic Handmade Cotton Deckled Paper Swatch
  // Center card from hero-paper-keepsake.png (unprinted textured paper with deckled edges)
  // Left: 240, Top: 160, Width: 650, Height: 800
  const deckledCardCrop = await sharp(heroPath)
    .extract({ left: 240, top: 160, width: 650, height: 800 })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'deckled-cotton-card.png'), deckledCardCrop);
  fs.writeFileSync(path.join(templateDir, 'deckled-cotton-card.png'), deckledCardCrop);
  console.log('Saved: deckled-cotton-card.png');

  // 5. Authentic Keepsake Couple Frame
  // Combine prewedding photo couple-1.jpg with deckle-photo-mat.png & paperclip-washi-accent.png
  const matPath = path.resolve('frontend/public/images/deckle-photo-mat.png');
  const clipPath = path.resolve('frontend/public/images/paperclip-washi-accent.png');
  const couplePath = path.resolve('frontend/public/images/prewedding/couple-1.jpg');

  if (fs.existsSync(matPath) && fs.existsSync(couplePath)) {
    const matMeta = await sharp(matPath).metadata();
    // Inner window of mat: approx 18% from left, 14% from top, 64% width, 70% height
    const innerW = Math.round(matMeta.width * 0.64);
    const innerH = Math.round(matMeta.height * 0.68);
    const innerX = Math.round(matMeta.width * 0.18);
    const innerY = Math.round(matMeta.height * 0.145);

    const resizedCouple = await sharp(couplePath)
      .resize(innerW, innerH, { fit: 'cover' })
      .toBuffer();

    // Composite: couple behind the mat, clip on top corner
    const frameBase = await sharp({
      create: {
        width: matMeta.width,
        height: matMeta.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([
      { input: resizedCouple, left: innerX, top: innerY },
      { input: matPath, left: 0, top: 0 }
    ])
    .png()
    .toBuffer();

    // Now add clip accent if exists
    let finalFrame = frameBase;
    if (fs.existsSync(clipPath)) {
      const clipResized = await sharp(clipPath)
        .resize(Math.round(matMeta.width * 0.38))
        .toBuffer();
      finalFrame = await sharp(frameBase)
        .composite([
          { input: clipResized, left: Math.round(matMeta.width * 0.58), top: 5 }
        ])
        .png()
        .toBuffer();
    }

    fs.writeFileSync(path.join(outDir, 'couple-keepsake-frame.png'), finalFrame);
    fs.writeFileSync(path.join(templateDir, 'couple-keepsake-frame.png'), finalFrame);
    console.log('Saved: couple-keepsake-frame.png');
  }

  // Clean up temporary test files
  const tempFiles = [
    'test-seal-crop.png',
    'test-flower-crop.png',
    'test-branch-crop.png',
    'test-seal-tight.png',
    'test-seal-centered.png'
  ];
  tempFiles.forEach(f => {
    const p = path.join(outDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log('All authentic keepsake assets generated successfully.');
}

main().catch(console.error);
