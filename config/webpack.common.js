//开发、生产、测试等不同的环境通常会分开配置，但实际上这些配置也有很多地方是通用的
//可以把这些通用的配置收归到一个文件，命名为webpack.common.js
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  //包体的入口文件。
  entry: {
    //使得Angular应用能够运行在大多数的现代浏览器。
    'polyfills': './src/polyfills.ts',
    //第三方依赖，如Angular、lodash和bootstrap.css。
    'vendor': './src/vendor.ts',
    //第三方依赖，如Angular、lodash和bootstrap.css。
    'app': './src/main.ts'
  },

  //省略扩展名时如何解释文件名。
  resolve: {
    //告诉Webpack，在查找这些没有扩展名的文件时，自动加上.ts或者.js扩展名来匹配。
    //Webapck也能解析不带扩展名的样式和HTML文件，在列表里追加.css和.html即可。
    extensions: ['.ts', '.js']
  },

  //module是一个对象，里面的rules属性用来决定文件如何加载。
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          }, 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw-loader'
      }
    ]
  },
  //创建插件的实例。
  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),

    //CommonsChunkPlugin标记出了三个块之间的等级体系：app -> vendor -> polyfills。 当Webpack发现app与vendor有共享依赖时，就把它们从app中移除。 
    //在vendor和polyfills之间有共享依赖时也同样如此(虽然它们没啥可共享的)
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    //Webpack生成了一些js和css文件。 虽然我们可以手动把它们插入到index.html中，但那样既枯燥又容易出错。 
    //Webpack可以通过HtmlWebpackPlugin自动为我们注入那些script和link标签。
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};

