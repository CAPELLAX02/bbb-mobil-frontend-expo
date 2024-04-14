import { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../assets/Colors';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import Background from '../components/Background';
import { BASE_ENDPOINT } from '../constants';

import * as Network from 'expo-network';
const fonksiyon = async () => {
  output = await Network.getIpAddressAsync();
  console.log(output);
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { signOut, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    fonksiyon();
    const fetchUserData = async () => {
      if (isAuthenticated) {
        setLoading(true);
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

          // API'den dönen veriyi kullanarak state güncelleme
          const { name, surname, phone, email } = response.data;
          setName(name);
          setSurname(surname);
          setPhone(phone);
          setEmail(email);

          setLoading(false);
        } catch (error) {
          console.log('221324');
          setLoading(false);
          console.log(error.message);
          // Hata yönetimi...
          Alert.alert('AAA');
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const handleSignOut = () => {
    setSignOutLoading(true);
    setTimeout(async () => {
      try {
        // await axios.post(`${BASE_ENDPOINT}/users/logout`);
        signOut();
        setSignOutLoading(false);
        Alert.alert('Çıkış Başarılı.');
      } catch (error) {
        setSignOutLoading(false);
        console.error('Error occurred while signing out:', error.message);
        // Handle error, if any
        Alert.alert('Çıkış yaparken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }, 1000);
  };

  return (
    <Background>
      <Header />

      <View style={styles.fullContainer}>
        {loading ? (
          <ActivityIndicator
            size={50}
            color='#777'
            style={{ marginVertical: 30 }}
          />
        ) : (
          <>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <Text style={{ fontFamily: 'pop-sb', fontSize: 20 }}>
                Birlikte 12 Sorunu Çözdük!
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>İsim: </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.infoText}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Soyisim: </Text>
              <TextInput
                value={surname}
                onChangeText={setSurname}
                style={styles.infoText}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Telefon: </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.infoText}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>E-Posta: </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.infoText}
              />
            </View>
          </>
        )}
        {signOutLoading ? (
          <ActivityIndicator
            size={50}
            color={Colors.dark}
            style={{ marginVertical: 10 }}
          />
        ) : (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons
              name='logout'
              size={24}
              color='#fff'
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText} onPress={handleSignOut}>
              Çıkış Yap
            </Text>
          </TouchableOpacity>
        )}
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
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 26,
    // backgroundColor: '#c9e77e',
    backgroundColor: '#eee',
    paddingVertical: 6,
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    ...sharedShadowStyles,
  },
  infoLabel: {
    marginRight: 10,
    paddingLeft: 6,
    fontSize: 15,

    fontFamily: 'pop-sb',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#666',

    fontFamily: 'pop',
  },
  editModeText: {
    margin: 7,
    color: '#555',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  editButton: {
    backgroundColor: '#1250a1',
    padding: 14,
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    width: '75%',
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'pop-b',
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
  editableInput: {
    // burada düzenleme modunda olunca textInput'un sahip olmasını istediğiniz stilleri tanımlayabilirsiniz.
    color: '#777',
    fontSize: 16,
    fontFamily: 'pop',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 14,
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    width: '75%',
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
});

export default Profile;
