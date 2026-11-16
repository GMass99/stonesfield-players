const fs = require("fs");
const yaml = require("js-yaml");
const { picture, largest } = require("./lib/images");

module.exports = function(eleventyConfig) {
  // Photos shrunk at build time (see lib/images.js and src/_data/archiveShows.js)
  eleventyConfig.addFilter("picture", picture);
  eleventyConfig.addFilter("largest", largest);

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  // Cloudflare Pages redirects (old .html addresses from the original site)
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // Changes on every build. Added to CSS/JS links (?v=...) so browsers fetch
  // the new files straight after an update instead of a copy cached for hours.
  eleventyConfig.addGlobalData("buildVersion", () => Date.now().toString(36));

  // The admin demo (/admin-demo/) uses the real admin config, but swaps the
  // backend for Decap's in-memory "test-repo", so nothing can ever be saved.
  eleventyConfig.addGlobalData("demoCmsConfig", () => {
    const config = yaml.safeLoad(fs.readFileSync("src/admin/config.yml", "utf8"));
    config.backend = { name: "test-repo" };
    delete config.auth;
    config.load_config_file = false;
    return config;
  });

  return {
    dir: {
      input: "src/pages",
      includes: "../_includes",
      data: "../_data",
      output: "_site"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
