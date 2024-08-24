// craco.config.js
module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                "crypto": require.resolve("crypto-browserify"),
                "path": require.resolve("path-browserify"),
                "stream": require.resolve("stream-browserify"),
                "buffer": require.resolve("buffer/")
            };
            return webpackConfig;
        }
    }
};
