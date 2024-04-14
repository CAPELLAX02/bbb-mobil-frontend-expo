import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginBackground({ children }) {
  return (
    <ImageBackground
      source={require('../assets/login-bg.png')}
      resizeMode='cover'
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
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
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  container: {
    flex: 1,
    width: '100%', // maxWidth kaldırıldı
    alignItems: 'stretch', // alignItems 'center' yerine 'stretch' kullanıldı
    justifyContent: 'center',
  },
});
