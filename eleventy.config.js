const lodash = require("lodash");
const slugify = require("slugify");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

function getAllKeyValues(collectionArray, key) {
  // get all values from collection
  let allValues = collectionArray.map((item) => {
    let values = item.data[key] ? item.data[key] : [];
    return values;
  });

  // flatten values array
  allValues = lodash.flattenDeep(allValues);
  // to lowercase
  //allValues = allValues.map((item) => item.toLowerCase());
  // remove duplicates
  allValues = [...new Set(allValues)];
  // order alphabetically
  allValues = allValues.sort(function (a, b) {
    return a.localeCompare(b, "en", { sensitivity: "base" });
  });
  // return
  return allValues;
}

function strToSlug(str) {
  const options = {
    replacement: "-",
    remove: /[&,+()$~%.'":*?<>{}]/g,
    lower: true,
  };

  return slugify(str, options);
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addCollection("events", function (collection) {
    return collection.getFilteredByGlob("./content/events/*.md").reverse();
  });

  eleventyConfig.addCollection("eventDistances", function (collection) {
    let allCategories = getAllKeyValues(
      collection.getFilteredByGlob("./content/events/*.md"),
      "distances"
    );

    let blogCategories = allCategories.map((category) => ({
      title: category,
      slug: strToSlug(category),
    }));

    return blogCategories;
  });

  eleventyConfig.addCollection("eventCities", function (collection) {
    let allCities = getAllKeyValues(
      collection.getFilteredByGlob("./content/events/*.md"),
      "cities"
    );

    return allCities.map((city) => ({
      title: city,
      slug: strToSlug(city),
    }));
  });

  eleventyConfig.addFilter("include", require("./filters/include.js"));

  eleventyConfig.addPassthroughCopy('public/');

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md and *.html files with Nunjucks: (default: `liquid`)
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "content", // default: "."
      data: "../_data", // default: "_data"
      includes: "../_includes", // default: "_includes"
      output: "_site",
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.
    pathPrefix: "/",
  };
};
