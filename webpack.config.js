
const path = require('path'); // утилита path превращает путь в абсолютный тк WP не понимает относительных

module.exports = {
    entry: { main: './src/index.js' }, // точка входа для wp
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
        },
    module: {
        rules: [{ // тут описываются правила
            test: /\.js$/, // регулярное выражение, которое ищет все js файлы
            use: { loader: "babel-loader" }, // весь JS обрабатывается пакетом babel-loader
            exclude: /node_modules/ // исключает папку node_modules
                }
            ]
        }
}
