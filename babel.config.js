module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-private-property-in-object',
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ].map(plugin => [plugin, { loose: true }]),
};
