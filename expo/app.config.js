const app = require('./app.json');
const { googleIosUrlScheme } = require('./src/googleOAuth.js');

const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID || '';

function withGoogleIosPlugin(plugins) {
  const scheme = googleIosUrlScheme(GOOGLE_IOS_CLIENT_ID);
  if (!GOOGLE_IOS_CLIENT_ID || !scheme) return plugins;
  return plugins.map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === '@react-native-google-signin/google-signin') {
      return [
        plugin[0],
        {
          ...(plugin[1] || {}),
          iosUrlScheme: scheme,
        },
      ];
    }
    return plugin;
  });
}

module.exports = () => {
  const expo = { ...app.expo, experiments: { ...(app.expo.experiments || {}) } };
  if (process.env.EXPO_WEB_BASE) expo.experiments.baseUrl = process.env.EXPO_WEB_BASE;
  const plugins = withGoogleIosPlugin(expo.plugins || []);
  const hasBuildProps = plugins.some(
    (p) => p === 'expo-build-properties' || (Array.isArray(p) && p[0] === 'expo-build-properties')
  );
  if (!hasBuildProps) {
    plugins.push([
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '15.1',
          extraPods: [
            { name: 'GoogleUtilities/Environment', modular_headers: true },
            { name: 'GoogleUtilities/UserDefaults', modular_headers: true },
            { name: 'RecaptchaInterop', modular_headers: true },
          ],
        },
      },
    ]);
  }
  expo.plugins = plugins;
  expo.ios = {
    ...(expo.ios || {}),
    usesAppleSignIn: true,
    entitlements: {
      ...(expo.ios?.entitlements || {}),
      'com.apple.developer.applesignin': ['Default'],
    },
  };
  return expo;
};