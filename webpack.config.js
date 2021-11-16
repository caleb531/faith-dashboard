const path = require('path');

module.exports = {
  entry: ['regenerator-runtime/runtime.js', './src/scripts/index.tsx'],
  mode: 'development',
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
    publicPath: '/dist/scripts',
    filename: 'bundle.js'
  }
};
