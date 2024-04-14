import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import Colors from '../assets/Colors';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Header = () => {
  return (
    <View style={styles.header}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={styles.logoText}> mobil</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.dark,
    // backgroundColor: '#66baff',
    height: windowHeight * 0.175,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    color: '#fff',
    fontFamily: 'pop-b',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
  },
  logo: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 24,
  },
});

export default Header;
