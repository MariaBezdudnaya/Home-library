const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },

    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.[hash].js', // <- ensure unique bundle name
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    host: "localhost",
    watchFiles: ["src/pages/*.html"],
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({filename: "styles.[hash].css"}),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/pages/index.html")
    })
  ]
};
