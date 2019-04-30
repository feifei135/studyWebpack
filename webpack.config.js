const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: {
        index: './src/index.js', // 项目的入口文件，webpack会从index.js开始，把所有依赖的js都加载打包
        // 需要被提取为公共模块的群组
        // vendors:['vue','vue-router','jquery'],
        // app: './src/index.js',
        // print: './src/print.js'
        another: './src/another-module.js'
    },
    // 配置插件项
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management'
        }),
        // new ExtractTextPlugin({
        //     filename: (getPath) => {
        //         return getPath('css/[name].css').replace('css/js', 'css');
        //     }, //生成文件的文件名
        //     // allChunks: false,
        //     // disable: false, //禁用插件
        //     // ignoreOrder: false //禁用顺序检查 (这对 CSS 模块很有用！)，默认 false
        // }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin()
    ],
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './dist'), // 项目的打包文件路径
        // publicPath: '/dist/', // 通过devServer访问路径
        filename: '[name].bundle.js', // 打包后的文件名
        chunkFilename: '[name].bundle.js'
    },
    // 其他解决方案
    // resolve: {
    //     // require时省略的扩展名，遇到.vue结尾的也要去加载
    //     extensions: ['','.js', '.vue'],
    //     // 模块别名地址，方便后续直接引用别名，无须写长长的地址，注意如果后续不能识别该别名，需要先设置root
    //     alias:{}
    // },
    // 不进行打包的模块
    // externals:{},
    // 模块加载器
    module: {
        // rules相当于gulp里的task，用来处理在入口文件中require的和其他方式引用进来的文件，test是正则表达式，匹配要处理的文件；loader匹配要使用的loader，"-loader"可以省略；include把要处理的目录包括进来，exclude排除不处理的目录       
        rules: [
            //  使用vue-loader 加载 .vue 结尾的文件
            {
                test: /\.vue$/, 
                use: 'vue-loader',
                exclude: /node_modules/    
            },
            // 使用babel 加载 .js 结尾的文件
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
                // query:{
                //     presets: ['es2015', 'stage-0'],  
                //     plugins: ['transform-runtime']                      
                // }
            }, 
            // 使用css-loader和style-loader 加载 .css 结尾的文件
            {  
                test: /\.css$/,      
                use: ['style-loader', 'css-loader'],          
                exclude: /node_modules/,
                // 将样式抽取出来为独立的文件
                // use: ExtractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: "css-loader", //loader 被用于将资源转换成一个 CSS 导出模块
                // })
            },
            // 加载图片
            // {
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use: [
            //         'file-loader'
            //     ],
            //     exclude: /node_modules/
            // },
            // 加载字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.bundle\.js$/,
                use: 'bundle-loader',
                exclude: /node_modules/
            },
            // 使用less-loader、css-loader和style-loade 加载 .less 结尾的文件
            // {  
            //     test: /\.less$/,                  
            //     // 将样式抽取出来为独立的文件
            //     loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader"),
            //     exclude: /node_modules/
            // },           
            // 加载图片
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:[{
                    loader: 'url-loader',
                    options: {
                        // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
                        limit: 10000,
                        // 路径要与当前配置文件下的publicPath相结合
                        name:'../img/[name].[ext]?[hash:7]'
                    }
                }]
            },
            // 加载图标
            // {
            //     test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            //     loader: 'file-loader',
            //     options: {               
            //         // 把较小的图标转换成base64的字符串内嵌在生成的js文件里    
            //         limit: 10000,
            //         name:'../fonts/[name].[ext]?[hash:7]',
            //         prefix:'font'
            //     }
            // },              
        ]         
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            // automaticNameDelimiter: '.',
            // cacheGroups: {
            // vendors: {
            //     test: /[\\/]node_modules[\\/]/,
            //     priority: 1
            // }
            // }
        },
        // runtimeChunk: {
        //     name: entrypoint => `manifest.${entrypoint.name}`
        // }
    },
    mode: "production"
};