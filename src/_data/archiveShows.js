// The archive's productions, ready for the templates. Each one gets its own
// web address (/archive/<show-name>/) and shrunk copies of its poster and photos.
// The content itself is edited in the admin and saved in src/_data/archive.json.
const fs = require("fs");
const path = require("path");
const { shrink } = require("../../lib/images");

function slugify(text) {
  return (
    String(text || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "show"
  );
}

module.exports = async function () {
  const archive = JSON.parse(fs.readFileSync(path.join(__dirname, "archive.json"), "utf8"));
  const used = new Set();
  const shows = [];

  for (const prod of archive.productions || []) {
    // Two shows with the same name (e.g. two "Mother Goose"s) get different addresses
    let slug = slugify(prod.title);
    if (used.has(slug)) slug = slugify(`${prod.title} ${prod.date_label}`);
    const base = slug;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);

    const photos = [];
    for (const photo of prod.photos || []) {
      if (photo && photo.image) photos.push({ ...photo, img: await shrink(photo.image, [600, 1600]) });
    }

    shows.push({
      ...prod,
      slug,
      url: `/archive/${slug}/`,
      posterImg: prod.poster ? await shrink(prod.poster, [400, 900]) : null,
      photos,
    });
  }
  return shows;
};
