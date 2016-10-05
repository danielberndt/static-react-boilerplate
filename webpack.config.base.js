const webpack = require("webpack");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const routeLoader = require("./web_loaders/routes-loader");

module.exports = function(env) {
  const isDev = env === "dev";
  const isProd = env === "prod";

  const envVars = isProd ? {
    "process.env.NODE_ENV": JSON.stringify("production")
  } : {
    "process.env.NODE_ENV": JSON.stringify("development")
  };

  return {
    contentBase: path.join(__dirname, "src"),

    entry: Object.assign({
      "main": [
        ...(isDev ? [require.resolve("react-dev-utils/webpackHotDevClient")] : []),
        "./src/client.js"
      ]
    }, isProd ? {
      "generate-html": "./src/generate-html.js"
    } : {}
    ),

    output: Object.assign({
      filename: "[name]-[hash].js",
      path: isProd ? "dist" : "/",
      publicPath: "/",
      libraryTarget: "umd", // required by StaticSiteGeneratorPlugin,
      hashDigestLength: 5
    }, isDev ? {
      pathinfo: true
    } : {}),

    devtool: isProd ? "source-map" : "eval",

    module: {
      loaders: [
        ...(isProd ? [
          {
            test: /\.html$/,
            loader: "html",
            query: {
              attrs: ['img:src', 'link:href'],
              conservativeCollapse: false
            }
          }
        ] : []),
        {
          test: /\.js?$/,
          loader: "babel",
          exclude: path.join(__dirname, "node_modules"),
          query: {
            plugins: [
              "transform-es2015-modules-commonjs", "syntax-jsx", "transform-react-jsx"
            ],
            presets: [["es2015", {"loose": true}]],
            cacheDirectory: true
          }
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          exclude: /\/favicon.ico$/,
          loader: "file",
          query: {
            name: "static/media/[name].[hash:5].[ext]"
          }
        },
        {
          test: /\/favicon.ico$/,
          loader: "file",
          query: {
            name: "favicon.ico?[hash:8]"
          }
        },
      ]
    },

    plugins: [
      new webpack.DefinePlugin(Object.assign(envVars, {__DEV__: isDev})),
      ...(isProd ? [
        new StaticSiteGeneratorPlugin(
          "generate-html",
          routeLoader.getRoutes("src/pages/Home.js").map(d => d.path)
        ),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {screw_ie8: true, warnings: false},
          mangle: {screw_ie8: true},
          output: {comments: false, screw_ie8: true}
        }),
      ] : []),
      ...(isDev ? [
        new HtmlWebpackPlugin({inject: true, template: "./src/index.html"})
      ] : [])
    ]
  }
};