import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const FORM_URL = 'https://TU-PROYECTO.netlify.app';

export default function FormularioEmbed() {
  // WEB
  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.wrapper}>
        <iframe
          src={FORM_URL}
          style={webStyles.iframe}
          title="Formulario"
        />
      </div>
    );
  }

  // iOS / Android
  return (
    <View style={styles.wrapper}>
      <WebView
        source={{ uri: FORM_URL }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 280,
    height: 335,
    backgroundColor: 'transparent',
    zIndex: 9999,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

const webStyles = {
  wrapper: {
    position: 'fixed' as const,
    bottom: '10px',
    right: '10px',
    width: '280px',
    height: '335px',
    zIndex: 9999,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    background: 'transparent',
  },
};
