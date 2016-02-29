const webpack = require('webpack')
const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const ROOT_PATH = path.resolve(__dirname)

const buidPath = process.env.NODE_ENV === 'production' ? 
  path.resolve(ROOT_PATH, 'dist') : 
  path.resolve(ROOT_PATH, 'build')

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? '' : 'source-map',
  entry: [
    path.resolve(ROOT_PATH, 'src/index')
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, './src'),
        path.resolve(__dirname, './node_modules/svg-flowline/')
      ],
      loaders: ['react-hot', 'babel']
    },
    { test: /\.json$/, loader: 'json' },
    {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: buidPath,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(ROOT_PATH, '.'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlwebpackPlugin({
      title: 'Flowlines redux'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
