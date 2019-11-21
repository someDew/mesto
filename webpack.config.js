
const path = require('path'); // утилита path превращает путь в абсолютный тк WP не понимает относительных
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
    entry: { main: './src/index.js' }, // точка входа для wp
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
        },
    module: {
        rules: [ // тут описываются правила
            { 
            test: /\.js$/, // регулярное выражение, которое ищет все js файлы
            use: { loader: "babel-loader" }, // весь JS обрабатывается пакетом babel-loader
            exclude: /node_modules/ // исключает папку node_modules
            },
            {
                test: /\.css$/, // применять это правило только к CSS-файлам
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] // к этим файлам нужно применить пакеты, которые мы уже установили
            }
            ]
        },
        plugins: [ 
            new MiniCssExtractPlugin({
                filename: 'style.[contenthash].css'
            }),
            new HtmlWebpackPlugin({
                inject: false, // стили НЕ нужно прописывать внутри тегов
                // hash: true, // для страницы нужно считать хеш
                template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
                filename: 'index.html' // имя выходного файла, то есть того, что окажется в папке dist после сборки
            }),
            new WebpackMd5Hash(),
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
               })
            ]
}
