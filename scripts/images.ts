/**
 * Turns source photos in assets/photos/{slot-id}.jpg into AVIF and WebP at responsive
 * widths under public/img, and records their dimensions in src/content/photos.json.
 * Swap a photo by replacing its source file and running `npm run assets`.
 */
import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp, { type Sharp } from "sharp";

const SOURCE_DIR = "assets/photos";
const OUT_DIR = "public/img";
const WIDTHS = [480, 800, 1200, 1600];
/** Every file stays under the hero budget; quality steps down until it fits. */
const MAX_BYTES = 140 * 1024;

async function encode(image: Sharp, format: "avif" | "webp", file: string): Promise<void> {
  for (let quality = format === "avif" ? 50 : 72; quality >= 30; quality -= 6) {
    const buffer =
      format === "avif"
        ? await image.clone().avif({ quality, effort: 6 }).toBuffer()
        : await image.clone().webp({ quality, effort: 6 }).toBuffer();
    if (buffer.length <= MAX_BYTES || quality - 6 < 30) {
      await writeFile(file, buffer);
      return;
    }
  }
}

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
    await encode(resized, "avif", `${OUT_DIR}/${id}-${w}.avif`);
    await encode(resized, "webp", `${OUT_DIR}/${id}-${w}.webp`);
  }
  manifest[id] = { width, height, widths };
  console.log(`${id}: ${widths.join(", ")}`);
}

await writeFile("src/content/photos.json", `${JSON.stringify(manifest, null, 2)}\n`);
