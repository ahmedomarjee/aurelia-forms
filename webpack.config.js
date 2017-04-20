const path = require("path");
const webpack = require("webpack");
const { AureliaPlugin, ModuleDependenciesPlugin } = require("aurelia-webpack-plugin");

module.exports = {
  entry: { "main": "aurelia-bootstrapper" },

  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "dist/",
    filename: "[name].js",    
    chunkFilename: "[name].js",
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"],
  },

  module: {
    rules: [
      { test: /\.less$/i, use: ["style-loader", "css-loader", "less-loader"], issuer: /\.[tj]s$/i },
      { test: /\.less$/i, use: ["css-loader", "less-loader"], issuer: /\.html$/i },
      { test: /\.css$/i, use: ["style-loader", "css-loader"], issuer: /\.[tj]s$/i },
      { test: /\.ts$/i, enforce: "pre", use: "source-map-loader" },
      { test: /\.ts$/i, use: "ts-loader" },
      { test: /\.html$/i, use: "html-loader" },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: "url-loader",
        options: {
          limit: 10000
        }
      }
    ]
  },  

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: module => /node_modules/.test(module.resource)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "devextreme",
      minChunks: module => /node_modules[\/\\]devextreme/.test(module.resource)
    }),
    new AureliaPlugin(),
  ],

  devtool: "inline-source-map"
};