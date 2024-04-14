import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Background from '../components/Background';
import Colors from '../assets/Colors';
import Header from '../components/Header';
import IssueFormModal from '../modals/IssueFormModal';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_ENDPOINT } from '../constants';

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [locationError, setLocationError] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [userName, setUserName] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) {
      return 'İyi geceler';
    } else if (hour < 12) {
      return 'Günaydın';
    } else if (hour < 18) {
      return 'Merhaba';
    } else {
      return 'İyi akşamlar';
    }
  };

  const fetchUserName = async () => {
    try {
      const userToken = await SecureStore.getItemAsync('regularUserToken');

      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await axios.get(
        `${BASE_ENDPOINT}/users/profile`,
        config
      );

      setUserName(response.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const fetchUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('İzin Hatası.', 'Konum izni reddedildi.');
      setLocationError(true);
      return;
    }
    let location;
    try {
      location = await Location.getCurrentPositionAsync({});
      setLocationError(false);
    } catch (error) {
      Alert.alert(
        'Konum Hatası!',
        'Konum bilgisi alınamadı. Lütfen konum izinlerini kontrol edin.',
        [{ text: 'Tamam' }]
      );
      setLocationError(true);
      return;
    }
    const { latitude, longitude } = location.coords;
    setUserLocation({ latitude, longitude });

    let address = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address && address.length > 0) {
      setUserAddress(
        `${address[0].subregion}, ${address[0].district} Mahallesi, ${address[0].street}, ${address[0].name}`
      );
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchUserLocation();
  }, []);

  return (
    <Background>
      <Header />
      <View style={styles.fullContainer}>
        <Text
          style={styles.welcomeText}
        >{`${getGreeting()} ${userName}!`}</Text>
        {/* "user?.name" => "user && user.name ? user.name : null" ternary operatörünün kısaltılmış halidir. */}
        <>
          <View style={styles.mapContainer}>
            {userLocation ? (
              <MapView
                // customMapStyle={customStyle}
                // onMapReady={fetchUserLocation}
                style={styles.map}
                region={{
                  latitude: userLocation ? userLocation.latitude : 39.6492,
                  longitude: userLocation ? userLocation.longitude : 27.8861,
                  latitudeDelta: 0.0015,
                  longitudeDelta: 0.0015,
                }}
              >
                {userLocation && (
                  <Marker
                    coordinate={userLocation}
                    title='Şu anki konumunuz'
                    description={userAddress}
                  />
                )}
              </MapView>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>
                  Konum bilginiz alındığında harita üzerindeki konumuzunu
                  görebileceksiniz.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {userAddress
                ? userAddress
                : locationError
                ? 'Konum bilgisine şu anda erişilemiyor. Konum servislerinizin aktif olduğundan emin olun.'
                : 'Konum bilgisi yükleniyor...'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!userLocation) {
                Alert.alert(
                  'Konum bilgisi alınamadı.',
                  'Sorun bildirmek için konumunuza erişmemiz gerekiyor.',
                  [{ text: 'TAMAM' }]
                );
              } else {
                // sorun bildir fonksiyonelliği, modal acılmalı burada
                setModalVisible(true);
              }
            }}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sorun Bildir</Text>
            </View>
          </TouchableOpacity>

          {/* Modal Bileşeni */}
          <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}
          >
            {modalVisible && (
              <IssueFormModal
                onClose={() => setModalVisible(false)}
                userAddress={userAddress}
              />
            )}
          </Modal>
        </>
      </View>
    </Background>
  );
};

const sharedShadowStyles = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4,
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    width: '100%', // Tüm genişliği kullan
    justifyContent: 'space-between', // İçerikleri eşit şekilde dağıt
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // backgroundColor: '#c9e77e',
    backgroundColor: '#f7f7f7',
  },
  mapContainer: {
    flex: 8,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.lightpurple,
    margin: 30,
    overflow: 'hidden',
    ...sharedShadowStyles,
    shadowRadius: 5.46,
  },
  map: {
    flex: 1,
  },
  button: {
    display: 'flex',
    backgroundColor: Colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 16,
    height: 55,
    width: '50%',
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'pop-b',
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    ...sharedShadowStyles,
    width: '85%',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: Colors.lightpurple,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'pop',
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
    fontFamily: 'pop',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'pop-sb',
  },
});

export default Home;
