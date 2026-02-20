import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
} from '@react-native-firebase/messaging';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/Navigators/AppNavigator';
import * as Animatable from 'react-native-animatable';
import ForceUpdate from './src/component/ForceUpdate';
// import ApiClient from './src/component/ApiClient'; // Optional

const App = () => {
  const [notification, setNotification] = useState(null);
  const deviceId = DeviceInfo.getUniqueId();     // Unique ID (may reset on uninstall)
  const model = DeviceInfo.getModel();

  // console.log('Device ID:', deviceId);
  // console.log("model", model)

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Notification permission denied');
          return;
        }
      }

      await getFcmToken();
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const getFcmToken = async () => {
    try {
      const app = getApp();
      const messaging = getMessaging(app);

      await messaging.registerDeviceForRemoteMessages(); // still needed
      const token = await getToken(messaging);

      // console.log('FCM Token:', token);

      await AsyncStorage.setItem('FCM_TOKEN', token);

      // Optional: Send to backend
      // await ApiClient.post('/update-fcm-token', {
      //   user_id: '1',
      //   fcm_token: token,
      // });

    } catch (error) {
      console.error('FCM token error:', error);
    }
  };

  const listenForForegroundMessages = () => {
    const messaging = getMessaging(getApp());

    const unsubscribe = onMessage(messaging, async remoteMessage => {
      // console.log('Foreground message received:', remoteMessage);

      if (remoteMessage?.notification) {
        setNotification(remoteMessage.notification);

        setTimeout(() => setNotification(null), 4000);
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    requestNotificationPermission();
    const unsubscribe = listenForForegroundMessages();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <AppNavigator />
<ForceUpdate/>
        {notification && (
          <Animatable.View
            animation="slideInDown"
            duration={500}
            style={styles.notificationBanner}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
          </Animatable.View>
        )}
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  notificationBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 15,
    zIndex: 9999,
    elevation: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationBody: {
    color: '#fff',
    marginTop: 5,
  },
});

export default App;
