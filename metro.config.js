const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Only use the mock when NOT building with EAS (i.e., when running in Expo Go locally)
const isEASBuild = !!process.env.EAS_BUILD;

if (!isEASBuild) {
    config.resolver.extraNodeModules = {
        ...config.resolver.extraNodeModules,
        'react-native-purchases': path.resolve(__dirname, 'mocks/react-native-purchases.js'),
    };
}

module.exports = config;
