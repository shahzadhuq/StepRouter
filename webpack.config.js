const path = require('path');

  module.exports = {
    entry: './src/stepRouter/controller/stepRouter.ts',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
    libraryTarget: 'umd',
    umdNamedDefine: true,
      filename: 'step-router.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
