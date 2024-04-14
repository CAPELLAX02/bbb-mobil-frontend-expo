import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function IssueBackground({ children }) {
  return (
    <ImageBackground
      source={require('../assets/issue-bg.png')}
      resizeMode='cover'
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// Background componentindeki stilleri güncelle
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%', // maxWidth kaldırıldı
    alignItems: 'stretch', // alignItems 'center' yerine 'stretch' kullanıldı
    justifyContent: 'center',
  },
});
