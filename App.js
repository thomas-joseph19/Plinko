import React, { useEffect, useRef } from 'react';
import { View, Platform, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Purchases from 'react-native-purchases';

// ─── CONFIGURATION ───
// Offline Mode: We bundle the game into a single JS string to avoid external hosting
import bundledGameHtml from './dist/game_bundled.js';

const debuggerHost = Constants.expoConfig?.hostUri;
const localIp = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
const devUrl = `http://${localIp}:5173/game.html`;

// Use Dev URL if running locally (npm run dev), otherwise use Bundled HTML (Offline Mode)
const webViewSource = __DEV__
    ? { uri: devUrl }
    : { html: bundledGameHtml, baseUrl: '' };

// RevenueCat Config
const RC_API_KEYS = {
    apple: 'goog_FecausrHExPmUXyZUWXPFeFoDNM', // Example keys - user should replace
    google: 'goog_FecausrHExPmUXyZUWXPFeFoDNM'
};

export default function App() {
    const webViewRef = useRef(null);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            const apiKey = Platform.OS === 'ios' ? RC_API_KEYS.apple : RC_API_KEYS.google;
            Purchases.configure({ apiKey });
        }
    }, []);

    const handleMessage = async (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('Native received message:', data.type);

            if (data.type === 'PURCHASE') {
                try {
                    const { customerInfo, productIdentifier } = await Purchases.purchaseProduct(data.productId);
                    // Check if entitlement is active or just return success for gems
                    webViewRef.current.postMessage(JSON.stringify({
                        type: 'PURCHASE_SUCCESS',
                        productId: productIdentifier,
                        amount: data.amount,
                        context: data.context
                    }));
                    Alert.alert('Success', 'Purchase completed!');
                } catch (e) {
                    if (!e.userCancelled) {
                        Alert.alert('Error', e.message);
                    }
                    webViewRef.current.postMessage(JSON.stringify({
                        type: 'PURCHASE_ERROR',
                        error: e.message
                    }));
                }
            }

            if (data.type === 'RESTORE') {
                const customerInfo = await Purchases.restorePurchases();
                webViewRef.current.postMessage(JSON.stringify({
                    type: 'RESTORE_RESULT',
                    customerInfo
                }));
            }
        } catch (e) {
            console.warn('Error handling WebView message:', e);
        }
    };

    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <iframe
                    src="/game.html"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="PLINKO∞"
                />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <WebView
                    ref={webViewRef}
                    source={webViewSource}
                    style={styles.webview}
                    onMessage={handleMessage}
                    allowsBackForwardNavigationGestures
                    domStorageEnabled
                    javaScriptEnabled
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    scrollEnabled={false}
                    bounces={false}
                    originWhitelist={['*']}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#08060f',
    },
    container: {
        flex: 1,
        backgroundColor: '#08060f',
    },
    webview: {
        flex: 1,
        backgroundColor: '#08060f',
    },
});
