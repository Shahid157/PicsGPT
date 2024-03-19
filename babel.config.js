module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['react-native-reanimated/plugin'],
    'add-react-displayname',
    './node_modules/@freshpaint/freshpaint-react-native/plugin.js',
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
