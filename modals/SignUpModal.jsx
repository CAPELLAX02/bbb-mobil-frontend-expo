import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import RegisterBackground from '../components/RegisterBackground';
import Colors from '../assets/Colors';
import { StatusBar } from 'expo-status-bar';
import VerificationModal from './VerificationModal';
import { BASE_ENDPOINT } from '../constants';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const SignUpModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);

  const isStrongPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    return regex.test(password);
  };

  const clearInputs = () => {
    setName('');
    setSurname('');
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  };

  const handlePhoneChange = (input) => {
    let cleaned = ('' + input).replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      const formattedNumber =
        '0' + match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4];
      setPhone(formattedNumber);
    } else {
      setPhone(input);
    }
  };

  const handleSignUp = async () => {
    if (
      name === '' ||
      surname === '' ||
      phone === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      Alert.alert(
        'Kayıt Başarısız.',
        'Lütfen gerekli alanların tamamını doldurun.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'İşlem Başarısız.',
        'Şifreler eşleşmiyor, lütfen tekrar deneyiniz.'
      );
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        'Şifreniz Zayıf.',
        'Şifreniz en az 8 karakter uzunluğunda olmalı; en az birer tane büyük harf, küçük harf, rakam ile özel karakter içermelidir.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_ENDPOINT}/users`, {
        name,
        surname,
        phone,
        email,
        password,
      });

      setLoading(false);
      setVerificationModalVisible(true);
    } catch (error) {
      console.error(error.response || error.toJSON());
      Alert.alert(
        'Kayıt Hatası',
        error.response?.data?.message ||
          'Kayıt işlemi sırasında bir hata oluştu.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeSubmit = async (code) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_ENDPOINT}/users/verify-email`, {
        email,
        verificationCode: code,
      });
      Alert.alert(
        'Başarılı!',
        'E-posta adresiniz başarıyla doğrulandı. Lütfen giriş yapın.'
      );
      setLoading(false);
      setVerificationModalVisible(false);
      clearInputs();
      onClose();
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Doğrulama Hatası',
        error.response?.data?.message ||
          'Doğrulama kodu hatalı veya süresi dolmuş.'
      );
    }
  };

  return (
    <RegisterBackground>
      <View style={styles.fullContainer}>
        <Text style={styles.title}>Hemen Aramıza Katıl!</Text>
        <TextInput
          placeholder='Adınız'
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor='#acacd2'
        />
        <TextInput
          placeholder='Soyadınız'
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
          placeholderTextColor='#acacd2'
        />
        <TextInput
          placeholder='Telefon Numaranız'
          style={styles.input}
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType='phone-pad'
          maxLength={14}
          placeholderTextColor='#acacd2'
        />
        <TextInput
          placeholder='E-posta Adresiniz'
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          placeholderTextColor='#acacd2'
        />
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder='Şifreniz'
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor='#acacd2'
          />
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesome
              name={isPasswordVisible ? 'eye-slash' : 'eye'}
              size={22}
              color='#fff'
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder='Şifreniz (Tekrar)'
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            placeholderTextColor='#acacd2'
          />
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            <FontAwesome
              name={isConfirmPasswordVisible ? 'eye-slash' : 'eye'}
              size={22}
              color='#fff'
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size={50}
            color={Colors.orange}
            style={{ marginVertical: 10 }}
          />
        ) : (
          <TouchableOpacity style={styles.button1} onPress={handleSignUp}>
            <Text style={styles.buttonText1}>Kayıt Ol</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button2} onPress={onClose}>
          <Text style={styles.buttonText2}>Vazgeç</Text>
        </TouchableOpacity>
      </View>

      <StatusBar hidden={true} />

      <VerificationModal
        visible={verificationModalVisible}
        onConfirm={handleVerificationCodeSubmit}
        onCancel={() => setVerificationModalVisible(false)}
      />
    </RegisterBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fullContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  title: {
    fontSize: 21,
    marginBottom: 16,
    fontFamily: 'pop-b',
    color: '#fff',
  },
  input: {
    width: '85%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.125)',
    borderWidth: 1.5,
    borderColor: '#ddd',
    fontSize: 14,
    fontFamily: 'pop-sb',
    color: '#fff',
  },
  button1: {
    backgroundColor: Colors.orange,
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 10,
    width: '50%',
  },
  buttonText1: {
    color: '#333',
    fontSize: 17,
    fontFamily: 'pop-b',
    textAlign: 'center',
  },
  button2: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderWidth: 1.5,
    borderColor: '#fff',
    width: '32%',
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'pop-sb',
    textAlign: 'center',
  },
  iconWrapper: {
    padding: 10,
    position: 'absolute',
    right: 5,
    top: 2,
  },
});

export default SignUpModal;
