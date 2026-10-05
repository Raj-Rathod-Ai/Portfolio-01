import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const galleryDir = path.resolve(__dirname, '../gallery-media');
const manifestPath = path.join(galleryDir, 'manifest.json');

const videoExts = new Set(['.mp4', '.webm', '.mov', '.ogg', '.m4v']);
const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export function scanGallery() {
  if (!fs.existsSync(galleryDir)) return [];
  const files = fs.readdirSync(galleryDir);
  const media = [];

  for (const file of files) {
    if (file === 'manifest.json') continue;
    const ext = path.extname(file).toLowerCase();
    if (videoExts.has(ext)) {
      media.push({
        name: file,
        src: `/gallery-media/${file}`,
        type: 'video'
      });
    } else if (imageExts.has(ext)) {
      media.push({
        name: file,
        src: `/gallery-media/${file}`,
        type: 'image'
      });
    }
  }

  const manifest = {
    lastUpdated: new Date().toISOString(),
    media
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`[Gallery Auto-Detect] Updated manifest.json with ${media.length} media items.`);
  return media;
}

scanGallery();
