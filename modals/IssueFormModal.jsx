import { useState, useEffect } from 'react';
import {
  View,
  // ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import Colors from '../assets/Colors';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import IssueBackground from '../components/IssueBackground';
import { BASE_ENDPOINT } from '../constants';

const IssueFormModal = ({ onClose, userAddress }) => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  // const [photoLoading, setPhotoLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');

  const clearForm = () => {
    setTitle('');
    setCode('');
    setImage(null);
    setImageName('');
    setDescription('');
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Kameranın açılması için izin vermeniz gerekmektedir.');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      // setPhotoLoading(true);
      const asset = pickerResult.assets[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 300 } }],
        { format: 'jpeg' }
      );
      setImage(resizedImage.uri);
      // setPhotoLoading(false);
      let imageName = asset.uri.split('/').pop();
      setImageName(imageName);
    }
  };

  const uploadPhoto = async (photo) => {
    console.log('Received photo object:', photo); // Fotoğraf objesini logla
    if (!photo || !photo.uri) {
      console.log('No photo or photo URI is undefined');
      return; // Fotoğraf yoksa veya URI tanımlı değilse işlemi durdur
    }

    const formData = new FormData();
    formData.append('image', {
      uri: photo.uri,
      type: 'image/jpeg', // Fotoğrafın MIME tipi
      name: 'photo.jpg', // Fotoğrafın dosya adı
    });

    const userToken = await SecureStore.getItemAsync('regularUserToken');

    try {
      const response = await axios.post(`${BASE_ENDPOINT}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Bu kısmı değiştirdim
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data.imagePath; // Yüklenen fotoğrafın URL'sini döndür
    } catch (error) {
      console.error('Error uploading photo: ', error);
      return null; // Hata durumunda null döndür
    }
  };

  const submitForm = async () => {
    if (!title.trim() || !image) {
      Alert.alert('Lütfen gerekli alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const photoUrl = await uploadPhoto({
        uri: image,
        type: 'image/jpeg',
        name: imageName,
      });
      if (!photoUrl) {
        Alert.alert('Fotoğraf yüklenirken bir hata oluştu.');
        setLoading(false);
        return;
      }

      const issueData = {
        title,
        code,
        description,
        image: photoUrl,
        address: userAddress,
      };

      const userToken = await SecureStore.getItemAsync('regularUserToken');

      console.log(title);
      console.log(code);
      console.log(description);

      const response = await axios.post(`${BASE_ENDPOINT}/issues`, issueData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      Alert.alert(
        'Teşekkürler!',
        'Bildirdiğin sorun ile en kısa zaman içerisinde ilgileneceğiz.'
      );
      clearForm();
      onClose();
      navigation.navigate('Sorunlar');
    } catch (error) {
      console.error('Sorunu kaydederken bir hata oluştu: ', error);
      Alert.alert('Bir hata oluştu.', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    onClose();
  };

  return (
    <IssueBackground>
      <View style={styles.fullContainer}>
        {/* <ScrollView> */}
        <View style={styles.inputContainer}>
          {/* <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View> */}
          <TextInput
            style={styles.input}
            value={title}
            placeholder='Sorunun Başlığı'
            onChangeText={(text) => setTitle(text)}
            placeholderTextColor='#666'
          />
        </View>

        <View style={styles.inputContainer}>
          {/* <View style={styles.badge}>
          <Text style={styles.badgeText}>2</Text>
        </View> */}
          <TextInput
            style={styles.input}
            value={code}
            placeholder='Sorun ne ile ilgili?'
            onChangeText={(text) => setCode(text)}
            placeholderTextColor='#666'
          />
        </View>

        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <MaterialCommunityIcons
            name='camera-marker-outline'
            size={28}
            style={{ paddingLeft: 12 }}
            color='#fff'
          />
          <Text style={styles.cameraText}>
            {image ? 'Tekrar Fotoğraf Çek' : 'Sorunun Fotoğrafını Çek'}
          </Text>
        </TouchableOpacity>

        <View style={styles.previewContainer}>
          {image ? (
            <Image
              resizeMode='cover'
              source={{ uri: image }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.previewText}>
              Sorunun fotoğrafını çektiğinizde bu alanda görebileceksiniz.
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textArea}
            value={description}
            placeholder='Sorunu detaylandır.'
            multiline
            onChangeText={(text) => setDescription(text)}
            blurOnSubmit={true}
            placeholderTextColor='#666'
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
          {loading ? (
            <ActivityIndicator size={27} color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Sorunu Bildir</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Vazgeç</Text>
        </TouchableOpacity>
        {/* </ScrollView> */}
      </View>
    </IssueBackground>
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 30,
    ...sharedShadowStyles,
  },
  badge: {
    width: 32,
    height: 32,
    // borderRadius: 40,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    // fontSize: 14,
    padding: 8,
    borderRadius: 30,
    width: '90%',
    fontFamily: 'pop',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
    width: '76%',
    alignSelf: 'center',
    borderRadius: 30,
    ...sharedShadowStyles,
  },
  cameraText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'pop-sb',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
  },
  previewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 220,
    borderRadius: 12,
    margin: 8,
    backgroundColor: Colors.lightblue,
    ...sharedShadowStyles,
  },
  previewText: {
    fontSize: 12,
    color: '#0a2e5c',
    textAlign: 'center',
    fontFamily: 'pop',
    padding: 10,
  },
  textArea: {
    backgroundColor: '#fff',
    marginTop: 4,
    padding: 8,
    borderRadius: 10,
    fontSize: 14,
    width: '90%',
    fontFamily: 'pop',
  },
  submitButton: {
    backgroundColor: Colors.dark,
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 10,
    width: '50%',
    ...sharedShadowStyles,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'pop-b',
    textAlign: 'center',
  },

  closeButton: {
    backgroundColor: '#333',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    width: '32%',
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'pop-sb',
    textAlign: 'center',
  },
});

export default IssueFormModal;
