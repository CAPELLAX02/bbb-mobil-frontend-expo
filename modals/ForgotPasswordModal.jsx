import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Colors from '../assets/Colors';
import axios from 'axios';
import { BASE_ENDPOINT } from '../constants';

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetPasswordCode, setResetPasswordCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const closeModalAndClear = () => {
    setStep(1); // İlk adıma dön
    setEmail(''); // E-posta inputunu temizle
    setResetPasswordCode(''); // Reset kodu inputunu temizle
    setNewPassword(''); // Yeni şifre inputunu temizle
    setConfirmNewPassword(''); // Yeni şifre tekrar inputunu temizle
    setLoading(false); // Yükleme durumunu sıfırla
    onClose(); // Modalı kapat
  };

  // İlk adımda e-posta adresine şifre sıfırlama kodu gönderiliyor
  const handleSendCode = async () => {
    setLoading(true);
    try {
      await axios.post(`${BASE_ENDPOINT}/users/forgot-password`, {
        email,
      });
      Alert.alert(
        'Başarılı',
        'Sıfırlama kodu e-posta adresinize gönderildi. Gelen kutunuzu kontrol edin.'
      );
      setStep(2); // İkinci adıma geçiş yapılıyor
    } catch (error) {
      Alert.alert(
        'Hata',
        'Şifre sıfırlama kodu gönderilirken bir hata oluştu.'
      );
    } finally {
      setLoading(false);
    }
  };

  // İkinci adımda kullanıcıdan alınan kod ve yeni şifre ile şifre sıfırlama işlemi tamamlanıyor
  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    setLoading(true);
    console.log(email);
    console.log(resetPasswordCode);
    console.log(newPassword);
    try {
      await axios.post(`${BASE_ENDPOINT}/users/reset-password`, {
        email,
        resetPasswordCode,
        newPassword,
      });
      Alert.alert(
        'Başarılı',
        'Şifreniz başarıyla sıfırlandı. Yeni şifreniz ile giriş yapabilirsiniz.',
        [
          { text: 'OK', onPress: () => closeModalAndClear() }, // Başarılı işlem sonrası modalı kapat ve temizle
        ]
      );
      onClose(); // Modal kapatılıyor ve kullanıcı giriş sayfasına yönlendirilebilir
    } catch (error) {
      console.log(error);
      Alert.alert('Hata', 'Şifre sıfırlama işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {step === 1 && (
            <>
              <Text style={styles.modalText}>E-posta Adresinizi Girin</Text>
              <TextInput
                style={styles.modalInput}
                // placeholder='E-posta adresinizi giriniz'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleSendCode}
                disabled={loading}
              >
                <Text style={styles.textStyle}>
                  {loading ? 'Gönderiliyor...' : 'Devam Et'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {step === 2 && (
            <>
              <Text style={styles.modalText}>
                Şifre Sıfırlama Bilgilerini Girin
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder='Sıfırlama Kodu'
                value={resetPasswordCode}
                onChangeText={setResetPasswordCode}
                keyboardType='number-pad'
              />
              <TextInput
                style={styles.modalInput}
                placeholder='Yeni Şifre'
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
              />
              <TextInput
                style={styles.modalInput}
                placeholder='Yeni Şifre Tekrar'
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.textStyle}>
                  {loading ? 'İşleniyor...' : 'Şifreyi Sıfırla'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={closeModalAndClear}
          >
            <Text style={styles.textStyle}>Vazgeç</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Yarı saydam siyah arka plan
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'pop-sb',
    color: Colors.dark,
  },
  modalInput: {
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.lightpurple,
    width: 300,
    fontFamily: 'pop-sb',
    fontSize: 16,
    color: Colors.dark,
  },
  button: {
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 14,
    width: '100%',
    marginTop: 20,
  },
  buttonConfirm: {
    backgroundColor: Colors.dark, // Onay butonu rengi
  },
  buttonCancel: {
    backgroundColor: Colors.red, // İptal butonu rengi
  },
  textStyle: {
    color: 'white',
    fontFamily: 'pop-sb',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default ForgotPasswordModal;
