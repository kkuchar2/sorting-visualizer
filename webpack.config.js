const HtmlWebPackPlugin = require("html-webpack-plugin");
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const resolvePath = pathSegments => path.resolve(__dirname, pathSegments);

const optimization = {
    runtimeChunk: 'single',
    splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
            reactVendor: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: "react-vendor"
            },
            utilityVendor: {
                test: /[\\/]node_modules[\\/](lodash|moment|moment-timezone)[\\/]/,
                name: "utility-vendor"
            },
            bootstrapVendor: {
                test: /[\\/]node_modules[\\/](react-bootstrap)[\\/]/,
                name: "bootstrap-vendor"
            },
            threeVendor: {
                test: /[\\/]node_modules[\\/](three)[\\/]/,
                name: "three-vendor"
            },
            vendor: {
                test: /[\\/]node_modules[\\/](!react-bootstrap)(!lodash)(!moment)(!moment-timezone)[\\/]/,
                name: "vendor"
            },
        },
    }
};

module.exports = {
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000
    },
    output: {
        filename: 'chunk-[name]-[contenthash].js',
        globalObject: "(typeof self!='undefined'?self:this)",
        pathinfo: false
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        modules: ['node_modules', resolvePath('src/js')],
        alias: {
            images: resolvePath('images/'),
            configs: resolvePath('configs/'),
            components: resolvePath('src/js/components/'),
            util: resolvePath('src/js/util/'),
            workers: resolvePath('src/js/workers'),
            styles: resolvePath('src/scss/'),
            componentStyles: resolvePath('src/scss/components/')
        }
    },
    optimization: optimization,
    devServer: {
        port: 3000,
        host: "localhost",
        historyApiFallback: true,
        open: true,
        hot: false,
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        }
    },
    plugins: [
        new HtmlWebPackPlugin({template: resolvePath("src/index.html")}),
        new MomentLocalesPlugin({localesToKeep: ['es-us', 'pl']}),
        new CompressionPlugin({algorithm: 'gzip', test: /\.js$/}),
        new CopyPlugin({
            patterns: [
                {from: resolvePath('images'), to: resolvePath('dist/images')},
            ],
        }),
        new webpack.DefinePlugin({
            'process.env': {
                FB_API_KEY: JSON.stringify(process.env.FB_API_KEY),
                FB_AUTH_DOMAIN: JSON.stringify(process.env.FB_AUTH_DOMAIN),
                FB_PROJECT_ID: JSON.stringify(process.env.FB_PROJECT_ID),
                FB_STORAGE_BUCKET: JSON.stringify(process.env.FB_STORAGE_BUCKET),
                FB_MESSAGING_SENDER_ID: JSON.stringify(process.env.FB_MESSAGING_SENDER_ID),
                FB_APP_ID: JSON.stringify(process.env.FB_APP_ID),
                FB_MEASUREMENT_ID: JSON.stringify(process.env.FB_MEASUREMENT_ID),
            },
        })
    ],
    module: {
        rules: [
            { // JS + JSX
                test: /\.(js|jsx)$/,
                include: resolvePath('src'),
                exclude: /node_modules/,
                use: [{loader: 'babel-loader'}]
            },
            { // TS + TSX
                test: /\.(ts|tsx)$/,
                include: resolvePath('src'),
                exclude: /node_modules/,
                use: [{loader: 'babel-loader'}],
            },
            { // Files
                test: /\.(png|jpg|gif|ico|svg|ttf|woff|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve(__dirname),
                            useRelativePath: true
                        }
                    }
                ]
            },
            { // SCSS
                test: /\.(scss)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            },
            { // CSS
                test: /\.(css)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            }
        ]
    }
};
