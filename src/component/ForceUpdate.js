import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Modal,
  StyleSheet,
  BackHandler,
  AppState,
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import ApiClient from './ApiClient';

/* ---------------- VERSION COMPARE ---------------- */
const compareVersions = (current, latest) => {
  const a = current.split('.').map(Number);
  const b = latest.split('.').map(Number);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const v1 = a[i] || 0;
    const v2 = b[i] || 0;

    if (v2 > v1) return true;
    if (v2 < v1) return false;
  }
  return false;
};

const ForceUpdate = () => {
  const [visible, setVisible] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');

  /* ------------ CHECK VERSION ------------ */
  const checkVersion = async () => {
    try {
      const currentVersion = VersionCheck.getCurrentVersion();

      const res = await ApiClient.get('/app-version');
      if (res?.data?.status !== 200) return;

      const serverData = res.data.data;
      const latestVersion = serverData.app_version;

      const needUpdate = compareVersions(currentVersion, latestVersion);

      // console.log("Current:", currentVersion);
      // console.log("Latest:", latestVersion);
      // console.log("Need Update:", needUpdate);

      if (needUpdate) {
        setUpdateUrl(serverData.app_url);
        setVisible(true);
      } else {
        setVisible(false);
      }

    } catch (e) {
      console.log('Force update error:', e);
    }
  };

  /* ------------ BLOCK BACK BUTTON ------------ */
  useEffect(() => {
    const backAction = () => true; // completely block back
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  /* ------------ CHECK ON APP OPEN ------------ */
  useEffect(() => {
    checkVersion();
  }, []);

  /* ------------ CHECK WHEN USER RETURNS FROM PLAYSTORE ------------ */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        setTimeout(checkVersion, 1500);
      }
    });
    return () => subscription.remove();
  }, []);

  /* ------------ UI ------------ */
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>

          <Text style={styles.title}>Update Required</Text>

          <Text style={styles.text}>
            You must update the app to continue using it.
            Please install the latest version from Play Store.
          </Text>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => Linking.openURL(updateUrl)}
          >
            <Text style={styles.updateText}>Update Now</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default ForceUpdate;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.80)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#d32f2f',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 20,
  },
  updateBtn: {
    backgroundColor: '#d32f2f',
    width: '100%',
    padding: 14,
    borderRadius: 10,
  },
  updateText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
