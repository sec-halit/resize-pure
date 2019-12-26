const path = require('path');

module.exports = {
  entry: './src/index.ts',
//  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    // libraryTarget: 'window',
    library: 'ResizePure',
    umdNamedDefine: true
  },
};