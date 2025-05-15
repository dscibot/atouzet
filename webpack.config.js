const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });

  config.devServer = {
    ...config.devServer,
    historyApiFallback: true, // utile pour React Navigation web ou React Router
  };

  return config;
};
