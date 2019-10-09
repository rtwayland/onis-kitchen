/* eslint-disable no-param-reassign */
module.exports = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    // Add react-hot-loader/patch to beginning of webpack entry array
    const entryArray = ['react-hot-loader/patch', ...webpackConfig.entry];
    webpackConfig.entry = entryArray;
    // Alias 'react-dom' to use hot-loader. This is required to make hot reloading work
    const alias = {
      'react-dom': '@hot-loader/react-dom',
      ...webpackConfig.resolve.alias,
    };
    webpackConfig.resolve.alias = alias;

    return webpackConfig;
  },
};
