import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin'; 

module.exports = {
  mode: 'development',
  entry: './src/client/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true
            }
          }
        ]
      },
      // This is needed to resolve some wierd import error relating to 
      // strict ECMAScript modules and named imports
      {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './public/index.html'
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
};