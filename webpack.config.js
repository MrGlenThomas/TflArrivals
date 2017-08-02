/* eslint-disable global-require */

const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const pkg = require('./package.json');

const isDebug = global.DEBUG === false ? false : !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = !!global.HMR; // Hot Module Replacement (HMR)
const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: useHMR,
});

// Webpack configuration (client/main.js => public/dist/main.{hash}.js)
// http://webpack.github.io/docs/configuration.html
const config = {

  // The base directory for resolving the entry option
  context: path.resolve(__dirname, './client'),

  // The entry point for the bundle
  entry: [
    /* Material Design Lite (https://getmdl.io) */
    '!!style-loader!css-loader!react-mdl/extra/material.min.css',
    'react-mdl/extra/material.min.js',
    /* The main entry point of your JavaScript application */
    './main.js',
  ],

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(__dirname, './public/dist'),
    publicPath: '/dist/',
    filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  ',
  },

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'source-map' : false,

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __DEV__: isDebug,
    }),
    // Emit a JSON file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, './public/dist'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
  ],
  // Options affecting the normal modules
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, './client'),
        ],
        loader: `babel-loader?${JSON.stringify(babelConfig)}`,
      },
      {
        test: /\.css/,
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: isDebug,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            // CSS Nano http://cssnano.co/options/
            minimize: !isDebug,
          })}`,
          //https://github.com/postcss/postcss-loader/issues/209
          {loader: 'postcss-loader', options: { plugins: () => [ 
          // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
          // https://github.com/postcss/postcss-import
          // require('postcss-import')({ addDependencyTo: bundler }),
          // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
          // https://github.com/postcss/postcss-custom-properties
          require('postcss-custom-properties'),
          // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
          // https://github.com/postcss/postcss-custom-media
          require('postcss-custom-media'),
          // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
          // https://github.com/postcss/postcss-media-minmax
          require('postcss-media-minmax'),
          // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
          // https://github.com/postcss/postcss-custom-selectors
          require('postcss-custom-selectors'),
          // W3C calc() function, e.g. div { height: calc(100px - 2em); }
          // https://github.com/postcss/postcss-calc
          require('postcss-calc'),
          // Allows you to nest one style rule inside another
          // https://github.com/jonathantneal/postcss-nesting
          require('postcss-nesting'),
          // W3C color() function, e.g. div { background: color(red alpha(90%)); }
          // https://github.com/postcss/postcss-color-function
          require('postcss-color-function'),
          // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
          // https://github.com/iamvdo/pleeease-filters
          require('pleeease-filters'),
          // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
          // https://github.com/robwierzbowski/node-pixrem
          require('pixrem'),
          // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
          // https://github.com/postcss/postcss-selector-matches
          require('postcss-selector-matches'),
          // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
          // https://github.com/postcss/postcss-selector-not
          require('postcss-selector-not'),
          // Add vendor prefixes to CSS rules using values from caniuse.com
          // https://github.com/postcss/autoprefixer
          require('autoprefixer') 
            ] }}, 

        ],
      },
      {
        test: /\.json$/,
        exclude: [
          path.resolve(__dirname, './client/routes.json'),
        ],
        loader: 'json-loader',
      },
      {
        test: /\.json$/,
        include: [
          path.resolve(__dirname, './client/routes.json'),
        ],
        loaders: [
          `babel-loader?${JSON.stringify(babelConfig)}`,
          path.resolve(__dirname, './client/utils/routes-loader.js'),
        ],
      },
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, './client/utils/markdown-loader.js'),
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)(\?.*)$/,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.(eot|ttf|wav|mp3)(\?.*)$/,
        loader: 'file-loader',
      },
    ],
  },
};

// Integrate Webpack 2.x (disable ES2015 modules)
babelConfig.presets[babelConfig.presets.indexOf('latest')] = ['latest', {
  es2015: {
    modules: false,
  },
}];

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: isVerbose,
    },
  }));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

// Hot Module Replacement (HMR) + React Hot Reload
if (isDebug && useHMR) {
  babelConfig.plugins.unshift('react-hot-loader/babel');
  config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;