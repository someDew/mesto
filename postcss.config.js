module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano')({ // подключил cssnano
            preset: 'default', // выбрал настройки по умолчанию
    })
]
}