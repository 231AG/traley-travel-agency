/**
 * Open Graph images (1200 x 630) for the service pages: the page's photo with the
 * unaltered logo wordmark on a white plate. Other pages use public/og/default.jpg.
 */
import sharp from "sharp";

const SLOTS = ["flights", "visa", "concierge"] as const;
const WORDMARK = { left: 97, top: 860, width: 1345, height: 452 };

const logo = await sharp("reference/logo-a.jpg")
  .extract(WORDMARK)
  .resize({ height: 110 })
  .toBuffer();
const { width: logoWidth = 0 } = await sharp(logo).metadata();
const plate = await sharp({
  create: { width: logoWidth + 48, height: 110 + 36, channels: 3, background: "#ffffff" },
})
  .composite([{ input: logo, top: 18, left: 24 }])
  .png()
  .toBuffer();

for (const slot of SLOTS) {
  await sharp(`assets/photos/${slot}.jpg`)
    .resize(1200, 630, { fit: "cover" })
    .composite([{ input: plate, left: 48, top: 630 - 146 - 48 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/og/${slot}.jpg`);
  console.log(`og/${slot}.jpg`);
}
