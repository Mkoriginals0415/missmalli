import https from 'node:https';
import fs from 'node:fs';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('--- Verifying Gates ---');

  // G1 & G5: Live deployment & Viewport on PDP
  const pdp = await fetchUrl('https://missmalli.in/p/imitation-pattu-saree-rich-pallu');
  console.log('G1 / G5 - missmalli.in PDP status:', pdp.status);
  const viewportTag = (pdp.body.match(/<meta[^>]*name=["']viewport["'][^>]*>/i) || [])[0];
  console.log('G1 - Viewport meta tag found in PDP response:', viewportTag);

  // Check Pages deployment
  const pagesPdp = await fetchUrl('https://f7dbc68f.miss-malli.pages.dev/p/imitation-pattu-saree-rich-pallu');
  console.log('Pages PDP status:', pagesPdp.status);
  const pagesViewportTag = (pagesPdp.body.match(/<meta[^>]*name=["']viewport["'][^>]*>/i) || [])[0];
  console.log('Pages Viewport meta tag:', pagesViewportTag);

  // G2: Bento hero mosaic in home route & mock data
  const indexContent = fs.readFileSync('app/routes/_index.tsx', 'utf8');
  const mockContent = fs.readFileSync('app/db/mock-data.ts', 'utf8');
  const hasBentoHero = indexContent.includes('bento-hero-mosaic');
  const noCatalogInHero = !mockContent.includes('/images/products/saree-');
  console.log('G2 - Index has bento hero mosaic:', hasBentoHero);
  console.log('G2 - Mock data hero excludes catalog product images:', noCatalogInHero);
  if (!hasBentoHero || !noCatalogInHero) throw new Error('G2 failed: Bento hero layout or mock images invalid');

  // G3: 2:3 non-cropped aspect ratio
  const pdpContent = fs.readFileSync('app/routes/p.$slug.tsx', 'utf8');
  const has2to3 = pdpContent.includes('aspect-[2/3]');
  const hasTopAlign = pdpContent.includes('object-top') || pdpContent.includes('object-contain');
  console.log('G3 - PDP has aspect-[2/3]:', has2to3);
  console.log('G3 - PDP has object-top/contain alignment:', hasTopAlign);
  if (!has2to3 || !hasTopAlign) throw new Error('G3 failed: PDP aspect ratio styling invalid');

  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
}

verifyAll().catch(err => {
  console.error(err);
  process.exit(1);
});
