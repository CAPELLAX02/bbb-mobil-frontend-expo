import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import Colors from '../assets/Colors';
import Background from '../components/Background';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_ENDPOINT } from '../constants';

const Issues = () => {
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log(1);
    const fetchIssues = async () => {
      console.log(2);
      try {
        console.log(3);
        const userToken = await SecureStore.getItemAsync('regularUserToken');
        console.log(4);
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };
        console.log(5);
        const { data } = await axios.get(
          `${BASE_ENDPOINT}/issues/myissues`,
          config
        );
        console.log(6);
        console.log(data);
        setIssues(data.userIssues);
        setLoading(false);
      } catch (error) {
        console.log('FETCHING ISSUES ERROR:', error);
      }
    };

    fetchIssues();
  }, [isFocused]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'solved':
        return { backgroundColor: '#8cf2b5' };
      case 'unsolved':
        return { backgroundColor: '#fad1d1' };
      default: // case 'pending'
        return { backgroundColor: '#fff0d6' };
    }
  };

  if (loading) {
    return (
      <Background>
        <Header />
        <View style={styles.fullContainer}>
          <View style={styles.container}>
            <ActivityIndicator size={50} color={Colors.red} />
          </View>
        </View>
      </Background>
    );
  } else if (issues.length === 0) {
    return (
      <Background>
        <Header />
        <View style={styles.fullContainer}>
          <View style={styles.noContentContainer}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                padding: 16,
                margin: 16,
                fontFamily: 'pop',
              }}
            >
              Henüz bir sorun bildirmediniz, bildirdiğinizde son durum
              bilgisiyle beraber burada görebileceksiniz.
            </Text>
          </View>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <Header />
      <View style={styles.fullContainer}>
        <FlatList
          data={issues}
          extraData={issues}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.issueContainer}>
                <Text
                  style={{
                    marginHorizontal: 1,
                    marginBottom: 10,
                    fontSize: 14,
                    fontFamily: 'pop-sb',
                  }}
                >
                  {item.title}
                </Text>
                <Image
                  source={{ uri: item.image.replace(/\\/g, '/') }}
                  style={styles.issueImage}
                />
                <Text
                  style={{
                    margin: 2,
                    padding: 2,
                    fontFamily: 'pop',
                  }}
                >
                  {item.description}
                </Text>
              </View>
              <View
                style={[styles.statusContainer, getStatusStyle(item.status)]}
              >
                <MaterialCommunityIcons
                  name='checkbox-multiple-marked-circle-outline'
                  size={26}
                  color='#333'
                  style={{ margin: 5 }}
                />

                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    fontFamily: 'pop',
                  }}
                >
                  {item.status === 'solved'
                    ? 'Bildirdiğiniz sorun çözüldü!'
                    : item.status === 'unsolved'
                    ? 'Maalesef bildirdiğiniz sorun çözülemedi.'
                    : 'Sorununuz bildirildi! En kısa zamanda çözülecektir.'}

                  <Text>{'\n----------------\n'}</Text>

                  {item.statusContent
                    ? item.statusContent
                    : 'Durum bilgisi bekleniyor...'}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Bildirilen Sorun</Text>
              <Text style={styles.headerText}>Durumu</Text>
            </View>
          )}
        />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
  },
  issueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.lightpurple,
    backgroundColor: Colors.light,
    marginHorizontal: 3,
  },
  issueImage: {
    width: 130,
    height: 180,
    borderRadius: 10,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.lightpurple,
    marginHorizontal: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 20,
  },
  headerText: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'pop-sb',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Issues;
