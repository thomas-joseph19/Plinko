import React, { useEffect, useRef } from 'react';
import { View, Platform, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Purchases from 'react-native-purchases';

import bundledHtml from './assets/game_bundled.js';

// ─── CONFIGURATION ───
const webViewSource = Platform.OS === 'web'
    ? { uri: '/game.html' }
    : {
        html: bundledHtml,
        baseUrl: 'https://thomas-joseph19.github.io/Plinko/'
    };

// RevenueCat Config
const RC_API_KEYS = {
    apple: 'goog_FecausrHExPmUXyZUWXPFeFoDNM', // Example keys - user should replace
    google: 'goog_FecausrHExPmUXyZUWXPFeFoDNM'
};

export default function App() {
    const webViewRef = useRef(null);

    useEffect(() => {
        console.log('App starting. Bundled HTML length:', bundledHtml?.length);
        if (bundledHtml) {
            console.log('Bundled HTML starts with:', bundledHtml.substring(0, 100));
        }
        const configurePurchases = async () => {
            if (Platform.OS !== 'web') {
                try {
                    // In Expo Go, native modules like Purchases are not available unless using a development build.
                    // We check if Purchases is defined and has the configure method.
                    if (Purchases && typeof Purchases.configure === 'function') {
                        const apiKey = Platform.OS === 'ios' ? RC_API_KEYS.apple : RC_API_KEYS.google;
                        await Purchases.configure({ apiKey });
                        console.log('Purchases configured successfully');
                    } else {
                        console.warn('Purchases module is not available in این environment (possibly Expo Go).');
                    }
                } catch (e) {
                    console.error('Error configuring Purchases:', e);
                }
            }
        };
        configurePurchases();
    }, []);

    const handleMessage = async (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('Native received message:', data.type);

            if (data.type === 'PURCHASE') {
                if (!Purchases) {
                    console.warn('Purchases not available in Expo Go.');
                    return;
                }
                try {
                    const { customerInfo, productIdentifier } = await Purchases.purchaseProduct(data.productId);
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
                if (!Purchases) {
                    console.warn('Purchases not available in Expo Go.');
                    return;
                }
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
        <View style={styles.container}>
            <StatusBar style="light" />
            <WebView
                ref={webViewRef}
                source={webViewSource}
                style={styles.webview}
                onMessage={handleMessage}
                onLoadEnd={() => console.log('WebView loaded successfully')}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView HTTP error: ', nativeEvent);
                }}
                allowsBackForwardNavigationGestures
                domStorageEnabled
                javaScriptEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                scrollEnabled={false}
                bounces={false}
                originWhitelist={['*']}
                javaScriptCanOpenWindowsAutomatically={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08060f',
        paddingTop: Platform.OS === 'ios' ? 50 : 0, // Fallback for safe area
    },
    webview: {
        flex: 1,
        backgroundColor: '#08060f',
    },
});
