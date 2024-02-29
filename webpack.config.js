const HtmlPlugin = require("html-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./client/src/index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle_[fullhash].js",
    clean: true,
  },
  plugins: [
    new HtmlPlugin({
      template: "./client/src/index.html",
    }),
    new CssPlugin({
      filename: "style_[fullhash].css",
    }),
  ],
  module: {
    rules: [
      {
        //babel
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    edge: "17",
                    chrome: "60",
                    firefox: "120",
                    safari: "17.3",
                    ie: "9",
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [CssPlugin.loader, "css-loader"],
      },
    ],
  },
  devServer: {
    port: 7777,
    static: {
      directory: path.join(__dirname, "build"),
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
};
