/**
 * Turns source photos in assets/photos/{slot-id}.jpg into AVIF and WebP at responsive
 * widths under public/img, and records their dimensions in src/content/photos.json.
 * Swap a photo by replacing its source file and running `npm run assets`.
 */
import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "assets/photos";
const OUT_DIR = "public/img";
const WIDTHS = [480, 800, 1200, 1600];

interface PhotoEntry {
  width: number;
  height: number;
  widths: number[];
}

await mkdir(OUT_DIR, { recursive: true });
const files = (await readdir(SOURCE_DIR)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file));
const manifest: Record<string, PhotoEntry> = {};

for (const file of files) {
  const id = path.parse(file).name;
  const input = sharp(path.join(SOURCE_DIR, file)).rotate();
  const { width = 0, height = 0 } = await input.metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  if (widths.length === 0) widths.push(width);
  for (const w of widths) {
    const resized = input.clone().resize({ width: w });
    await resized.clone().avif({ quality: 50, effort: 6 }).toFile(`${OUT_DIR}/${id}-${w}.avif`);
    await resized.clone().webp({ quality: 72, effort: 6 }).toFile(`${OUT_DIR}/${id}-${w}.webp`);
  }
  manifest[id] = { width, height, widths };
  console.log(`${id}: ${widths.join(", ")}`);
}

await writeFile("src/content/photos.json", `${JSON.stringify(manifest, null, 2)}\n`);
