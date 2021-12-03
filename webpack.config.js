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
    // new BundleAnalyzerPlugin()
  ]
};
