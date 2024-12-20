module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null, // blocklist -> blacklist
        whitelist: null, // allowlist -> whitelist
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'transform-inline-environment-variables',
      {
        include: ['BANNER_AD_UNIT_ID_DEV', 'BANNER_AD_UNIT_ID_PROD'],
      },
    ]
  ],
};
