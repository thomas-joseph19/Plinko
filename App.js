import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

// Build the URL to the Vite dev server running the game
// When on a real device, we need the local network IP
const debuggerHost = Constants.expoConfig?.hostUri || 'localhost:5173';
const localIp = debuggerHost.split(':')[0];
// Vite dev server should be running on port 5173
const gameUrl = `http://${localIp}:5173/game.html`;

export default function App() {
    // On Web: full-screen iframe
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <iframe
                    src="/game.html"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="PLINKO∞"
                />
            </View>
        );
    }

    // On Native (iOS/Android via Expo Go): WebView pointing to Vite dev server
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: gameUrl }}
                style={styles.container}
                allowsBackForwardNavigationGestures
                domStorageEnabled
                javaScriptEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08060f',
    },
});
