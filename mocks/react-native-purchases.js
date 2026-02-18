// Mock for react-native-purchases — used in Expo Go where native modules are unavailable.
const Purchases = {
    configure: () => Promise.resolve(),
    purchaseProduct: () => Promise.reject(new Error('IAP not available in Expo Go')),
    restorePurchases: () => Promise.resolve({}),
    getOfferings: () => Promise.resolve({ current: null }),
    getCustomerInfo: () => Promise.resolve({}),
    setLogLevel: () => { },
    LOG_LEVEL: { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' },
    PURCHASES_ERROR_CODE: {},
};

export default Purchases;
