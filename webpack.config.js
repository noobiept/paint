const Path = require("path");
const Fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

function readJSON(path) {
    const data = Fs.readFileSync(path);
    const json = JSON.parse(data.toString());
    return json;
}

module.exports = (env, argv) => {
    const package = readJSON("./package.json");
    const inDevMode = argv.mode === "development";

    return {
        entry: "./scripts/main.ts",
        output: {
            path: Path.resolve(
                __dirname,
                `release/${package.name} ${package.version}`
            ),
            filename: "bundle.js",
        },
        devtool: inDevMode ? "source-map" : false,
        devServer: {
            host: "localhost",
            port: 8000,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        plugins: [
            !inDevMode && new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./index.html",
            }),
            new CopyPlugin({
                patterns: [
                    { from: "./libraries", to: "libraries" },
                    { from: "./css", to: "css" },
                ],
            }),
        ].filter(Boolean),
    };
};
