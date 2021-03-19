const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const path = require("path");

module.exports = function override(config, env) {
  if (env === "production") {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        new SentryWebpackPlugin({
          authToken: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
          org: "diitto",
          project: "diitto",
          release: process.env.REACT_APP_RELEASE,
          include: path.resolve(__dirname, "./build/static"),
        }),
      ],
    };
  }
  return config;
};
