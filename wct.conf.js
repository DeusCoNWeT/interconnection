module.exports = {
  plugins: {
    local: {
      browsers: ["chrome","firefox"]
    },
    istanbul: {
      dir: "./coverage",
      reporters: ["text-summary", "lcov"],
      include: [
        "src/*.js"
      ],
      exclude: [
        "/polymer/polymer.js",
        "/platform/platform.js"
      ],
      thresholds: {
        global: {
          statements: 100
        }
      }
    }
  }
}
