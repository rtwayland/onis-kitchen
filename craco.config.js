const { ESLINT_MODES } = require('@craco/craco');
const reactHotLoaderPatch = require('./config/reactHotLoaderPatch');

module.exports = {
  eslint: {
    mode: ESLINT_MODES.file,
  },
  babel: { loaderOptions: { babelrc: true } },
  plugins: [{ plugin: reactHotLoaderPatch }],
};
