import { Image, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SplashScreen() {
  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
          aspectRatio: 1,
          backgroundColor: '#eee',
        }}
        source={require('../assets/lottie/animation.json')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
