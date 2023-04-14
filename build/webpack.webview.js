const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
module.exports = {
  entry: "./webview/src/main.ts",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "webview.js",
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(t|j)s$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/], //关键
        },
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          reactivityTransform: true,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./webview/index.html" }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: ["*", ".ts", ".js", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "../webview/src"),
    },
  },
  mode: "development",
  devServer: {
    port: 3010,
    open: true,
    hot: true,
  },
};
