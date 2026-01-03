const path = require("node:path");
const sass = require("sass");

module.exports = function (eleventyConfig) {
  // Inline CSS shortcode: compiles bundle.scss with compressed output and returns <style>...</style>
  let cachedInlineCss;
  eleventyConfig.addShortcode("inlineBundleCss", function () {
    if (cachedInlineCss) return cachedInlineCss;
    try {
      const result = sass.compile("bundle.scss", {
        // Resolve @use paths relative to project root
        loadPaths: ["."],
        style: "compressed",
      });
      cachedInlineCss = `<style>${result.css}</style>`;
      return cachedInlineCss;
    } catch (err) {
      console.error("Sass compile error for inlineBundleCss:", err);
      return "<!-- CSS failed to compile -->";
    }
  });

  // Ensure Eleventy rebuilds when SCSS changes
  eleventyConfig.addWatchTarget("./bundle.scss");
  eleventyConfig.addWatchTarget("./assets/styles/");

  // Clear CSS cache before each build to ensure fresh compilation
  eleventyConfig.on("beforeBuild", () => {
    cachedInlineCss = undefined;
  });

  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",

    // opt-out of Eleventy Layouts
    useLayouts: false,

    compile: async function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      // Don’t compile file names that start with an underscore
      if (parsed.name.startsWith("_")) {
        return;
      }

      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
        style: "compressed",
      });

      // Map dependencies for incremental builds
      this.addDependencies(inputPath, result.loadedUrls);

      return async (data) => {
        return result.css;
      };
    },
  });

  eleventyConfig.addTemplateFormats("scss");

  // Passthrough copy for assets folder to preserve folder structure
  eleventyConfig.addPassthroughCopy("assets/img");

  // Filter: format Date or date-like string to YYYY-MM-DD
  eleventyConfig.addFilter("dateYMD", (value) => {
    if (!value) return "";
    const d = (value instanceof Date) ? value : new Date(value);
    if (isNaN(d.getTime())) return String(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  });

  // Shortcode: render idejos body markdown without the YAML front matter
  eleventyConfig.addShortcode("idejosBody", function (idejos) {
    const body = (idejos?.body || "");
    return body;
  });
};
