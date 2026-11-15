// Logos for the social media links (footer, Contact page and the admin preview).
// They come from Font Awesome Free's brand icons (fontawesome.com, CC BY 4.0).
// The names must match the "Which site" choices in src/admin/config.yml.
const brands = require("@fortawesome/free-brands-svg-icons");

const PLATFORMS = {
  "Instagram": brands.faInstagram,
  "Facebook": brands.faFacebook,
  "TikTok": brands.faTiktok,
  "YouTube": brands.faYoutube,
  "X (Twitter)": brands.faXTwitter,
  "Threads": brands.faThreads,
  "Bluesky": brands.faBluesky,
};

function toSvg(definition) {
  const [width, height, , , path] = definition.icon;
  const d = Array.isArray(path) ? path.join(" ") : path;
  return (
    `<svg class="social-icon" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">` +
    `<!-- Font Awesome Free by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free -->` +
    `<path fill="currentColor" d="${d}"/></svg>`
  );
}

module.exports = Object.fromEntries(
  Object.entries(PLATFORMS).map(([name, definition]) => [name, toSvg(definition)])
);
