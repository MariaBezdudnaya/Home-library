module.exports = {
    presets: [["@babel/preset-env"]],
    plugins: [
        ["@babel/plugin-syntax-class-properties"],
        [
            "@babel/plugin-proposal-class-properties",
            {
                loose: true,
            },
        ],
        ["@babel/plugin-transform-private-property-in-object", { loose: true }],
        ["@babel/plugin-transform-private-methods", { loose: true }],
    ],
};
