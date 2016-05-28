const webpack = require('webpack');

module.exports = {
    entry: ['whatwg-fetch', 'babel-polyfill', './src/js/app.js'],
    output: {
        path: './src/bin',
        filename: 'app.bundle.js',
    },
    module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
          },
          {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: "style-loader!css-loader",
          },
      ]
    }
}
