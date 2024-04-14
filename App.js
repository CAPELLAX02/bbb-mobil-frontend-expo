import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import Colors from './assets/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { TouchableRipple } from 'react-native-paper';
import { Text, View, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './tabs/Home';
import Profile from './tabs/Profile';
import Issues from './tabs/Issues';
import { useState, useEffect } from 'react';
import SignInModal from './modals/SignInModal';
import SignUpModal from './modals/SignUpModal';
import BannedUserScreen from './modals/BannedUserScreen';
import SplashScreen from './components/SplashScreen';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;

const customFonts = {
  pop: require('./assets/fonts/Poppins-Regular.ttf'),
  'pop-b': require('./assets/fonts/Poppins-Bold.ttf'),
  'pop-sb': require('./assets/fonts/Poppins-SemiBold.ttf'),
};

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
};

import * as Network from 'expo-network';
const fonksiyon = async () => {
  output = await Network.getIpAddressAsync();
  console.log(output);
};

const AppContent = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadFonts = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    fonksiyon();
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (!isAuthenticated) {
    return <SignInModal />;
    // return (
    //   <View
    //     style={{
    //       backgroundColor: '#fff',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       flex: 1,
    //     }}
    //   >
    //     <LottieView
    //       autoPlay
    //       loop
    //       style={{
    //         width: 200,
    //         height: 200,
    //         aspectRatio: 1,
    //         backgroundColor: '#eee',
    //       }}
    //       source={require('./assets/lottie/animation.json')}
    //     />
    //   </View>
    // );
  }

  return (
    <>
      <NavigationContainer independent={true}>
        <StatusBar style='light' />
        <Tab.Navigator
          initialRouteName='Anasayfa'
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Colors.dark,
            tabBarStyle: {
              height: windowHeight * 0.08,
              padding: 8,
            },
            tabBarIconStyle: {},
            tabBarLabelStyle: {
              fontFamily: 'pop-sb',

              fontSize: 13,
            },
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              if (route.name === 'Profil') {
                iconName = focused
                  ? 'account-circle'
                  : 'account-circle-outline';
              } else if (route.name === 'Anasayfa') {
                iconName = focused ? 'home-circle' : 'home-circle-outline';
              } else if (route.name === 'Sorunlar') {
                iconName = focused
                  ? 'alert-circle-check'
                  : 'alert-circle-check-outline';
              }

              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={Number(windowHeight) * 0.041}
                  color={color}
                />
              );
            },
          })}
        >
          <Tab.Screen name='Profil' component={Profile} />
          <Tab.Screen name='Anasayfa' component={Home} />
          <Tab.Screen name='Sorunlar' component={Issues} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
