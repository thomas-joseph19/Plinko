module.exports = function (api) {
    api.cache(true);

    // Detect if we're building with EAS. If not, we assume we're in Expo Go 
    // and need the mock for native modules.
    const isEASBuild = !!process.env.EAS_BUILD;

    return {
        presets: ['babel-preset-expo'],
        plugins: !isEASBuild
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
