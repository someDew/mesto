const presets = [
    [
    "@babel/env",
    {
        targets: { // версии браузеров которые нужно поддерживать
            edge: "17",
            firefox: "60",
            chrome: "64",
            safari: "11.1",
            ie: "11"
        },
            useBuiltIns: "usage", // эта настройка babel-polyfill, если стоит значение usage,
                                  // то будут подставлятся полифилы для версий браузеров которые указали выше.
            corejs: "3.4.1", // явно проставить версию corejs
        },
    ],
];

module.exports = { presets };