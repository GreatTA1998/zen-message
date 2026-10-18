const app = require('./app.json');

module.exports = () => {
  const expo = { ...app.expo, experiments: { ...(app.expo.experiments || {}) } };
  if (process.env.EXPO_WEB_BASE) expo.experiments.baseUrl = process.env.EXPO_WEB_BASE;
  return expo;
};
