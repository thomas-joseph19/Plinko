module.exports = function (api) {
    api.cache(true);

    // Detect if we're running in Expo Go (no custom native modules)
    // We mock react-native-purchases so Expo Go doesn't crash
    const isExpoGo = process.env.EXPO_PUBLIC_ENV !== 'production';

    return {
        presets: ['babel-preset-expo'],
        plugins: isExpoGo
            ? [
                [
                    'module-resolver',
                    {
                        alias: {
                            'react-native-purchases': './mocks/react-native-purchases.js',
                        },
                    },
                ],
            ]
            : [],
    };
};
