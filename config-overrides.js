module.exports = function override(config, env) {
  // Fix the allowedHosts configuration issue
  if (config.devServer) {
    config.devServer.allowedHosts = 'all';
  }
  return config;
};
