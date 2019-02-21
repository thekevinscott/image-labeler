// karma.conf.js
module.exports = function(config) {
  config.set({
    client: {
      mocha: {
        timeout : 5000,
      }
    },

    frameworks: ["mocha", "karma-typescript"],
    files: [
      "src/**/*.ts" // *.tsx for React Jsx
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript" // *.tsx for React Jsx
    },
    reporters: ["progress", "karma-typescript"],
    browsers: ["Chrome"]

    // files: [
    //   // { pattern: "node_modules/expect.js/index.js" },
    //   { pattern: "src/**/*.spec.ts" }
    // ],

    /*
    reporters: ["dots", "karma-typescript"],

    browsers: ["ChromeHeadless"],

    singleRun: true
    */
  });
};
