// Shrinks photos when the site builds, so big phone photos don't slow pages down.
// The original upload stays as it is; visitors get smaller copies from /img/.
const path = require("path");

async function shrink(src, widths) {
  if (!src) return null;
  const { default: Image } = await import("@11ty/eleventy-img");
  const input = /^https?:\/\//.test(src) ? src : path.join("src", src);
  try {
    const meta = await Image(input, {
      widths,
      formats: ["webp", "jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
    });
    return { src, webp: meta.webp || [], jpeg: meta.jpeg || [] };
  } catch (err) {
    // A missing or unreadable file shouldn't stop the whole site building
    console.warn(`[images] Couldn't shrink ${src}: ${err.message}`);
    return { src, webp: [], jpeg: [] };
  }
}

function escapeAttr(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

// <picture> markup for a shrunk image (falls back to the original file)
function picture(img, alt, sizes, className) {
  if (!img) return "";
  const cls = className ? ` class="${escapeAttr(className)}"` : "";
  if (!img.jpeg.length) {
    return `<img src="${escapeAttr(img.src)}" alt="${escapeAttr(alt)}"${cls} loading="lazy" decoding="async">`;
  }
  const srcset = (list) => list.map((i) => `${i.url} ${i.width}w`).join(", ");
  const first = img.jpeg[0];
  const webp = img.webp.length
    ? `<source type="image/webp" srcset="${srcset(img.webp)}" sizes="${escapeAttr(sizes)}">`
    : "";
  return (
    `<picture>${webp}<img src="${first.url}" srcset="${srcset(img.jpeg)}" sizes="${escapeAttr(sizes)}" ` +
    `width="${first.width}" height="${first.height}" alt="${escapeAttr(alt)}"${cls} loading="lazy" decoding="async"></picture>`
  );
}

// Address of the biggest copy, for the full-size photo viewer
function largest(img) {
  if (!img) return "";
  return img.jpeg.length ? img.jpeg[img.jpeg.length - 1].url : img.src;
}

module.exports = { shrink, picture, largest };
