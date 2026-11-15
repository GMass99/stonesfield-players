const fs = require("fs");
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  // Cloudflare Pages redirects (old .html addresses from the original site)
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

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
