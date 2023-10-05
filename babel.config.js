module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-private-methods', { loose: true }],
    'react-native-reanimated/plugin',
    ['babel-plugin-rewrite-require', {
      aliases: {
        stream: 'readable-stream',
      },
    }],
    ['module:react-native-dotenv']
  ],
};