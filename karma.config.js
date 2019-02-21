// karma.conf.js
module.exports = function(config) {
  config.set({
    client: {
      mocha: {
        timeout : 10000,
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
  });
};
