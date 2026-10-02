const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ThemeWatcher = require('@salla.sa/twilight/watcher.js');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const asset = file => path.resolve('src/assets', file || '');
const public = file => path.resolve("public", file || '');


/**
 * Salla CLI preview requests theme assets under /assets/...
 * while the canonical Twilight build writes to public/.
 * Keep the canonical output intact and mirror emitted files into public/assets/
 * so both production and local preview URL shapes resolve correctly.
 */
class PreviewAssetsMirrorPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tap('PreviewAssetsMirrorPlugin', () => {
            const fs = require('fs');
            const root = path.resolve('public');
            const mirrorRoot = path.resolve('public/assets');

            // Salla local preview can resolve the asset filter to /assets/...
            // Mirror the complete emitted public tree (CSS, JS, images, etc.)
            // while explicitly skipping the mirror directory itself.
            fs.mkdirSync(mirrorRoot, {recursive: true});

            for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
                if (entry.name === 'assets') continue;

                const source = path.join(root, entry.name);
                const target = path.join(mirrorRoot, entry.name);

                if (entry.isDirectory()) {
                    fs.cpSync(source, target, {recursive: true, force: true});
                } else if (entry.isFile()) {
                    fs.mkdirSync(path.dirname(target), {recursive: true});
                    fs.copyFileSync(source, target);
                }
            }
        });
    }
}

module.exports = {
    entry  : {
        app: [asset('styles/app.scss'), asset('js/app.js')]
    },
    output : {
        path: public(),
        clean: true,
        chunkFilename: "[name].[contenthash].js"
    },
    stats  : {modules: false, assetsSort: "size", assetsSpace: 50},
    module : {
        rules: [
            {
                test   : /\.js$/,
                exclude: [
                    /(node_modules)/,
                    asset('js/twilight.js')
                ],
                use    : {
                    loader : 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                          "@babel/plugin-transform-runtime"
                        ],
                    }
                }
            },
            {
                test: /\.(s(a|c)ss)$/,
                use : [
                    MiniCssExtractPlugin.loader,
                    {loader: "css-loader", options: {url: false}},
                    "postcss-loader",
                    "sass-loader",
                ]
            },
        ],
    },
    plugins: [
        new ThemeWatcher(),
        new MiniCssExtractPlugin(),
    ],
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
}
;
