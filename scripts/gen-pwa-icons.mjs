import sharp from "sharp";

const shell = `<g transform="rotate(-35 12 12)" fill="none" stroke="#256F5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 12 C2 8 6 4.5 12 4.5 C18 4.5 22 8 22 12 C22 16 18 19.5 12 19.5 C6 19.5 2 16 2 12 Z" />
  <path d="M4 12 L6 10 L8 14 L10 10 L12 14 L14 10 L16 14 L18 10 L20 12" />
</g>`;

const svg = `<svg width="512" height="512" viewBox="0 0 24 24">
  <g transform="translate(12 12) scale(0.82) translate(-12 -12)">${shell}</g>
</svg>`;

await sharp(Buffer.from(svg))
  .resize(192, 192)
  .png()
  .toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg))
  .resize(512, 512)
  .png()
  .toFile("public/icons/icon-512.png");
await sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile("public/icons/apple-touch-icon.png");

const maskableSvg = `<svg width="512" height="512" viewBox="0 0 24 24">
  <g transform="translate(12 12) scale(0.7) translate(-12 -12)">${shell}</g>
</svg>`;

await sharp(Buffer.from(maskableSvg))
  .resize(512, 512)
  .png()
  .toFile("public/icons/icon-maskable.png");

// import sharp from "sharp";

// const BG = "#fcfcfc";

// const shell = `<g transform="rotate(-35 12 12)" fill="none" stroke="#256F5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//   <path d="M2 12 C2 8 6 4.5 12 4.5 C18 4.5 22 8 22 12 C22 16 18 19.5 12 19.5 C6 19.5 2 16 2 12 Z" />
//   <path d="M4 12 L6 10 L8 14 L10 10 L12 14 L14 10 L16 14 L18 10 L20 12" />
// </g>`;

// const svg = `<svg width="512" height="512" viewBox="0 0 24 24">
//   <rect width="24" height="24" fill="${BG}" />
//   ${shell}
// </svg>`;

// await sharp(Buffer.from(svg))
//   .resize(192, 192)
//   .png()
//   .toFile("public/icons/icon-192.png");
// await sharp(Buffer.from(svg))
//   .resize(512, 512)
//   .png()
//   .toFile("public/icons/icon-512.png");
// await sharp(Buffer.from(svg))
//   .resize(180, 180)
//   .png()
//   .toFile("public/icons/apple-touch-icon.png");

// const maskableSvg = `<svg width="512" height="512" viewBox="0 0 24 24">
//   <rect width="24" height="24" fill="${BG}" />
//   <g transform="translate(12 12) scale(0.7) translate(-12 -12)">${shell}</g>
// </svg>`;

// await sharp(Buffer.from(maskableSvg))
//   .resize(512, 512)
//   .png()
//   .toFile("public/icons/icon-maskable.png");
