const path = require("path");
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  productionSourceMap: false,
  outputDir: 'garden-web-html',
  publicPath: './',
  devServer: {
    port: 8081,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://122.112.165.72:8010',
        ws: true,
        changeOrigin: true,
        /*pathRewrite: {
          '^/api': '/'
        }*/
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 192,
            propList: ['*']
          })
        ]
      }
    }
  },
  configureWebpack: config => {
    config.externals= {
      'AMap': 'AMap' // 高德地图配置
    };
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    config.optimization = {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 10000, // 依赖包超过10000bit将被单独打包
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js  or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    };
  },
  chainWebpack: (config) => {
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all'
    });
    config.module.rule('js').test(/\.js$/).use('babel-loader').loader('babel-loader');
    // 压缩图片
    const imagesRule = config.module.rule('images');
    imagesRule.uses.clear();
    imagesRule.use('file-loader')
      .loader('url-loader')
      .options({
        limit: 10240,
        fallback: {
          loader: 'file-loader',
          options: {
            outputPath: 'zip/images'
          }
        }
      });
  }
}