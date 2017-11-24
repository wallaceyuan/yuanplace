var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/modules/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    devServer: {
        publicPath: "/static/",
        stats: { colors: true },
        port: 8080,
        contentBase: 'build',
        inline: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
};