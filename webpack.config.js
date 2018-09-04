const path = require('path')

module.exports = (env, argv) => ({
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: (argv.minimize) ? 'browser-file-storage.min.js' : 'browser-file-storage.js',
        library: 'browser-file-storage',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
        {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]
    },
    optimization: {
        minimize: (argv.minimize) ? true : false
    },
})