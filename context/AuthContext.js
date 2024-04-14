import { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BASE_ENDPOINT } from '../constants';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastChecked, setLastChecked] = useState(Date.now());

  const bootstrapAsync = async () => {
    let userToken;

    try {
      userToken = await SecureStore.getItemAsync('regularUserToken');

      if (userToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };

        try {
          const response = await axios.get(
            `${BASE_ENDPOINT}/users/profile`,
            config
          );

          console.log(response.data);
          console.log(response.data.isBanned);

          if (response.data.isBanned) {
            signOut();
            // navigation.navigate('BannedUserScreen')
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error(
            'Kullanıcı profil kontrolü sırasında bir hata oluştu: ',
            error
          );
          signOut();
        }
      } else {
        console.log('Kullanıcı tokeni SecureStoreda bulunamadı.');
      }
    } catch (error) {
      console.log(
        'Bootstrap async işlemi sırasında bir hata meydana geldi:',
        error
      );
    }
  };

  useEffect(() => {
    bootstrapAsync();
  }, [lastChecked]);

  const signIn = async (token) => {
    await SecureStore.setItemAsync('regularUserToken', token);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('regularUserToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
