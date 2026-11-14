module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  // Cloudflare Pages redirects (old .html addresses from the original site)
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

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
