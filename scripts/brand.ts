/**
 * Builds every logo asset from reference/logo-a.jpg by cropping and resizing only.
 * No recoloring or redrawing: the owner's logo files are fixed brand assets.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "reference/logo-a.jpg";
const OUT = "public/brand";
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

/** Pixel bounds measured from the 1536 x 1536 source (see PLAN.md, "Logo placement"). */
const WORDMARK = { left: 97, top: 860, width: 1345, height: 452 };
const MARK = { left: 360, top: 126, width: 868, height: 753 };

async function wordmark(): Promise<void> {
  const crop = sharp(SOURCE).extract(WORDMARK);
  const buffer = await crop.toBuffer();
  for (const height of [96, 144]) {
    const resized = sharp(buffer).resize({ height });
    await resized.clone().webp({ quality: 90 }).toFile(`${OUT}/wordmark-${height}.webp`);
    await resized
      .clone()
      .png({ compressionLevel: 9, palette: true })
      .toFile(`${OUT}/wordmark-${height}.png`);
  }
}

async function squareMark(size: number): Promise<Buffer> {
  return sharp(SOURCE)
    .extract(MARK)
    .resize(size, size, { fit: "contain", background: WHITE })
    .flatten({ background: WHITE })
    .png({ palette: true, quality: 90, compressionLevel: 9 })
    .toBuffer();
}

/** Minimal ICO container holding PNG-encoded images. */
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((image, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(image.size >= 256 ? 0 : image.size, entry);
    header.writeUInt8(image.size >= 256 ? 0 : image.size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(image.data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += image.data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

async function icons(): Promise<void> {
  const ico16 = await squareMark(16);
  const ico32 = await squareMark(32);
  await writeFile(
    "public/favicon.ico",
    ico([
      { size: 16, data: ico16 },
      { size: 32, data: ico32 },
    ]),
  );
  await writeFile("public/favicon-32.png", ico32);
  await writeFile("public/apple-touch-icon.png", await squareMark(180));
  await writeFile(`${OUT}/icon-192.png`, await squareMark(192));
  await writeFile(`${OUT}/icon-512.png`, await squareMark(512));
}

async function socialImage(): Promise<void> {
  const logo = await sharp(SOURCE).resize({ height: 600 }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: WHITE } })
    .composite([{ input: logo, top: 15, left: 300 }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile("public/og/default.jpg");
}

await mkdir(OUT, { recursive: true });
await mkdir("public/og", { recursive: true });
await Promise.all([wordmark(), icons(), socialImage()]);
console.log("Brand assets written to public/");
