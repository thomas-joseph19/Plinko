import React from 'react';
import { View, Platform, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri || 'localhost:5173';
const localIp = debuggerHost.split(':')[0];
const gameUrl = `http://${localIp}:5173/game.html`;

export default function App() {
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
                    source={{ uri: gameUrl }}
                    style={styles.webview}
                    allowsBackForwardNavigationGestures
                    domStorageEnabled
                    javaScriptEnabled
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    scrollEnabled={false}
                    bounces={false}
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
