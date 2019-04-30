// 引入依赖模块
const express = require('express');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

// 创建一个express实例
var app = express();

const config = require('./webpack.dev.config.js');
// 调用webpack并把配置传递过去
var compiler = webpack(config);
// 对网站首页的访问返回 "Hello World!" 字样

app.get('/', function (req, res) {
    res.send('Hello World!');
});

// 使用 webpack-dev-middleware 中间件，搭建服务器
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

// 使用 webpack-hot-middleware 中间件，实现热加载
var hotMiddleware = require('webpack-hot-middleware')(compiler);

// 为了修改html文件也能实现热加载，使用webpack插件来监听html源文件改变事件
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件
        hotMiddleware.publish({ action: 'reload' });
        cb();
    })
});

// 注册中间件
app.use(devMiddleware);
app.use(hotMiddleware);

// 监听 8082 端口，开启服务器
app.listen(8082, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:8888');
})