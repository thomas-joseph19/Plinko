const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// In Expo Go, react-native-purchases native module is not available.
// We redirect it to a mock so the app doesn't crash.
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'react-native-purchases': path.resolve(__dirname, 'mocks/react-native-purchases.js'),
};

module.exports = config;
