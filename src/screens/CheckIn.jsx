import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';

const CheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [records, setRecords] = useState([]);
  const [showDisclosure, setShowDisclosure] = useState(false);

  const { user, token } = useAuth();

  // ✅ LOCATION PERMISSION
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    try {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (fine === PermissionsAndroid.RESULTS.GRANTED) {
        const bg = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
        return bg === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert('Permission Denied', 'Enable location from settings.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
      }

      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // ✅ GET LOCATION
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (error) => {
          Alert.alert('Location Error', error.message);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  };

  // ✅ API CALL
  const sendData = async (coords, type) => {
    try {
      const res = await ApiClient.post(
        '/check-in',
        {
          type,
          user_id: user?.user_id,
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        Alert.alert('Success', res.data.message);

        setCheckedIn(type === 'checkin');

        setRecords((prev) => [
          {
            id: Date.now().toString(),
            name: user?.name || 'User',
            claim: type === 'checkin' ? 'Checked In' : 'Checked Out',
            time: new Date().toLocaleTimeString(),
            status: type,
          },
          ...prev,
        ]);
      }
    } catch (e) {
      Alert.alert('Error', 'Server error');
    }
  };

  // ✅ HANDLE ACTION AFTER CONSENT
  const proceedAfterConsent = async () => {
    setShowDisclosure(false);
    const location = await getCurrentLocation();
    if (location) {
      sendData(location, checkedIn ? 'checkout' : 'checkin');
    }
  };

  // ✅ BUTTON CLICK
  const handlePress = () => {
    setShowDisclosure(true);
  };

  // ✅ LIST ITEM
  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.rowOdd : styles.rowEven]}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
      <Text style={styles.cell}>{item.claim}</Text>
      <Text style={styles.cell}>{item.time}</Text>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status === 'checkin' ? '#28a745' : '#dc3545',
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In / Check Out</Text>

      <TouchableOpacity
        style={[styles.button, checkedIn && styles.checkoutButton]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>
          {checkedIn ? 'Check Out' : 'Check In'}
        </Text>
      </TouchableOpacity>

      {/* TABLE */}
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, { flex: 2, color: '#fff' }]}>Name</Text>
          <Text style={[styles.cell, { color: '#fff' }]}>Claim</Text>
          <Text style={[styles.cell, { color: '#fff' }]}>Time</Text>
          <Text style={[styles.cell, { color: '#fff' }]}>Status</Text>
        </View>

        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', margin: 10 }}>
              No records yet
            </Text>
          }
        />
      </View>

      {/* ✅ DISCLOSURE POPUP */}
      {showDisclosure && (
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Location Permission</Text>

            <Text style={styles.popupText}>
              We collect your location data to enable check-in and check-out
              functionality.

              {'\n\n'}Used for:
              {'\n'}• Attendance marking
              {'\n'}• Location tracking
              {'\n'}• Service accuracy

              {'\n\n'}We do not share your data.
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#ccc' }]}
                onPress={() => setShowDisclosure(false)}
              >
                <Text>Deny</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#003961' }]}
                onPress={proceedAfterConsent}
              >
                <Text style={{ color: '#fff' }}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CheckIn;

// ✅ STYLES
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },

  title: { textAlign: 'center', marginBottom: 15 },

  button: {
    backgroundColor: '#003961',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  checkoutButton: { backgroundColor: '#dc3545' },

  buttonText: { color: '#fff' },

  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  row: { flexDirection: 'row', padding: 10 },

  header: { backgroundColor: '#003961' },

  rowEven: { backgroundColor: '#f9f9f9' },

  rowOdd: { backgroundColor: '#fff' },

  cell: { flex: 1, textAlign: 'center', fontSize: 12 },

  statusBadge: {
    // flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    height: 10,
    width:25
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popup: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },

  popupTitle: { fontWeight: 'bold', marginBottom: 10 },

  popupText: { fontSize: 13, color: '#333' },

  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});