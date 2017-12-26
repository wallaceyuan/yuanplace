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
    new webpack.NamedModulesPlugin() // 执行热替换时打印模块名字
]
if (env === 'production') {
    plugins.push(new UglifyJSPlugin({
        sourceMap: true
    }));
    outputFile = 'bundle.min.js';
} else {
    outputFile = 'bundle.js';
}


module.exports = {
    entry: [
        'react-hot-loader/patch', // 激活HMR
        path.resolve(__dirname, './react/index.js')
    ],
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
                include: __dirname + /src/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["style-loader","css-loader","sass-loader"],
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