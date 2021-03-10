module.exports = {
  configureWebpack: {
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/dst-farm-planner/'
    : '/'
}