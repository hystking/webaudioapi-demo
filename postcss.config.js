module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-assets")({
      loadPaths: ["public/img/"],
      relative: "public/css/"
    }),
    require("autoprefixer")({
      browsers: [
        "ie >= 10",
        "ios >= 8",
        "android >= 4.0",
      ],
    }),
    require("css-mqpacker"),
    require("cssnano"),
  ],
}
