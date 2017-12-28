var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var env = process.env.NODE_ENV;

console.log('env',env)


var outputFile;
var plugins = [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin("styles.css"),
    new HtmlWebpackPlugin({
        title: 'React Biolerplate by YuanYuan',
        template: path.resolve(__dirname, 'template.html')
    }),
    new webpack.HotModuleReplacementPlugin(), // 热替换插件
    new webpack.NamedModulesPlugin(), // 执行热替换时打印模块名字
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: Infinity
    })
]
if (env === 'production') {
    plugins.push(new UglifyJSPlugin({
        sourceMap: true
    }));
    outputFile = '[name].[hash:8].min.js';
} else {
    outputFile = '[name].[hash:8].js';
}


module.exports = {
    entry: {
        bundle:[path.resolve(__dirname, './react/src/modules/index.js')]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase:'./dist',
        publicPath: '/',
        port: 8080,
        hot:true,
        historyApiFallback: true
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                    publicPath: "/dist"
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader","sass-loader"],
                    publicPath: "/dist"
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: outputFile,
        publicPath: ''
    },
    plugins: plugins
};