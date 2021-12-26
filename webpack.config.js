const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: ['./src/scripts/index.tsx'],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: 'scripts/',
    filename: '[name].bundle.js'
  },
  plugins: [
    // By default, Webpack compiles all Moment locales into a single bundle,
    // which substantially increases page weight; to fix, use the IgnorePlugin
    // plugin to discard all locale files (the 'en' locale appears to be baked
    // into the MomentJS core); see
    // <https://github.com/jmblog/how-to-optimize-momentjs-with-webpack>
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ]
};
