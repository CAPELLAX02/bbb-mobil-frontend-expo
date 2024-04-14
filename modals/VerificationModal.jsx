import { useState } from 'react';
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

const VerificationModal = ({ visible, onConfirm, onCancel }) => {
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    onConfirm(code); // Parent komponentteki doğrulama fonksiyonunu çağır
  };

  return (
    <Modal animationType='fade' transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Doğrulama Kodunu Girin</Text>
          <TextInput
            style={styles.modalInput}
            // placeholder='__ __ __ __ __ __'
            value={code}
            onChangeText={setCode}
            keyboardType='number-pad'
            maxLength={6}
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonConfirm]}
            onPress={handleConfirm}
          >
            <Text style={styles.textStyle}>Kayıt İşlemini Tamamla</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={onCancel}
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
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'pop-sb',
    color: Colors.dark, // Örneğin: Koyu mavi veya siyah
  },
  modalInput: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Colors.lightpurple,
    fontSize: 20,
    letterSpacing: 6,
    width: 180, // 6 haneli bir kod için genişlik, piksel cinsinden
    textAlign: 'center', // Metni ortalayarak daha estetik bir görünüm sağlar
    fontFamily: 'pop-sb',
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
    backgroundColor: Colors.dark, // Örneğin: Canlı mavi
  },
  buttonCancel: {
    backgroundColor: Colors.red, // Örneğin: Hafif kırmızı
  },
  textStyle: {
    color: 'white',
    fontFamily: 'pop-sb',
    textAlign: 'center',
  },
});

export default VerificationModal;
