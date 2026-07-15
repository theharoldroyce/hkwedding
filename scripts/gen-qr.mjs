// One-off generator for the guest "Wedding Snapshots" QR code.
//   node scripts/gen-qr.mjs https://yourdomain.com
// Encodes <domain>/snapshots (the mobile QR-scan landing page) and writes:
//   public/qr-guest-snapshots.svg   — the raw QR (scalable, for embedding/printing)
// It also prints the SVG path data so it can be inlined into a printable page.
import QRCode from "qrcode";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const base = (process.argv[2] || "").replace(/\/+$/, "");
if (!base) {
  console.error("Usage: node scripts/gen-qr.mjs https://yourdomain.com");
  process.exit(1);
}

const url = `${base}/snapshots`;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// High error-correction so the code still scans if a printed copy gets a little
// dirty or has a logo placed over the center later.
const svg = await QRCode.toString(url, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: "#1a1a1a", light: "#ffffff" },
});

await writeFile(join(root, "public", "qr-guest-snapshots.svg"), svg, "utf8");
console.log(`Encoded: ${url}`);
console.log("Wrote:   public/qr-guest-snapshots.svg");
