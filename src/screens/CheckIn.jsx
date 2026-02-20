import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Platform, Linking, FlatList } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const CheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [records, setRecords] = useState([]);
  const { user, token } = useAuth();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location for check-in.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
      else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert('Permission Denied', 'Enable location from settings.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
        return false;
      } else {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return false;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => {
          Alert.alert('Location Error', error.message);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const getvalue = async (coords, type) => {
    if (!coords) {
      Alert.alert('Error', 'Location data is not available.');
      return;
    }
    try {
      const res = await ApiClient.post('/check-in', {
        type,
        user_id: user?.id || '1',
        latitude: coords.latitude,
        longitude: coords.longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        Alert.alert('Status', res.data.message);
        setCheckedIn(type === 'checkin');
        setRecords(prev => [
          {
            id: Date.now().toString(),
            name: user?.name || 'User',
            claim: type === 'checkin' ? 'Checked In' : 'Checked Out',
            time: new Date().toLocaleTimeString(),
            status:  type ,
          },
          ...prev
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Network or server issue occurred.');
    }
  };

  const handleCheckIn = async () => {
    const location = await getCurrentLocation();
    if (location) getvalue(location, 'checkin');
  };

  const handleCheckOut = async () => {
    const location = await getCurrentLocation();
    if (location) getvalue(location, 'checkout');
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
      <Text style={styles.cell}>{item.claim}</Text>
      <Text style={styles.cell}>{item.time}</Text>
        <Text style={styles.cell}>
  <View style={[
  styles.statusBadge,
  { backgroundColor: item.status === 'checkin' ? '#006016' : '#dc3545' }
]}>
  {/* <Icon
    name={item.status === 'checkin' ? 'login' : 'logout'}
    size={5}
    color={item.status === 'checkin' ? '#006016' : '#dc3545'}
  /> */}
</View></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In / Check Out</Text>

      <TouchableOpacity
        style={[styles.button, checkedIn && styles.checkoutButton]}
        onPress={checkedIn ? handleCheckOut : handleCheckIn}
      >
        <Text style={styles.buttonText}>{checkedIn ? 'Check Out' : 'Check In'}</Text>
      </TouchableOpacity>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, { flex: 2, fontWeight: 'bold',color:"#fff" }]}>Name</Text>
          <Text style={[styles.cell, { fontWeight: 'bold',color:"#fff"  }]}>Claim</Text>
          <Text style={[styles.cell, { fontWeight: 'bold' ,color:"#fff" }]}>Time</Text>
          <Text style={[styles.cell, { fontWeight: 'bold',color:"#fff"  }]}>Status</Text>
        </View>
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 10, color: '#e00101' }}>No records yet.</Text>}
        />
      </View>
    </View>
  );
};

export default CheckIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#003961',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 1,
    // alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#003961',
  },
  rowEven: {
    backgroundColor: '#f7f7f7',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
    fontSize: 12,
  },
  statusBadge: {
  padding: 6,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
},
});