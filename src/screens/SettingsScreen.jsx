import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import context
import { useLayoutEffect } from 'react';
import { getCurrentLocation } from '../component/Refresh';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth(); // Destructure logout
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Filter")} style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      title: "Settings",
      headerStyle: { backgroundColor: "#f5f5f5" },
      headerTitleStyle: { fontSize: 20, },
    });
  }, [navigation]);
  // console.log(user.role)
  return (
    <View style={styles.container}>
      {/* Row 2 */}
      {
        user?.role === "Admin" && (
          <View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('UserManagement')}>
                <Image source={require('../../Assets/icons/usermanagement.png')} style={{ width: 35, height: 35 }} />
                <Text style={styles.boxText}>User Management</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('MasterSetting')}>
                <Image source={require('../../Assets/icons/Mastersetting.png')} style={{ width: 35, height: 35 }} />
                <Text style={styles.boxText}>Master Setting</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Table')}>
                <Image source={require('../../Assets/icons/allleads.png')} style={{ width: 35, height: 35 }} />
                <Text style={styles.boxText}>View All Leads</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('ShareScreen')}>
                <Image source={require('../../Assets/icons/sharing.png')} style={{ width: 35, height: 35 }} />
                <Text style={styles.boxText}>Share App</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }


      <View style={styles.row}>
        {/* <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Setting')}>
          <Image source={require('../../Assets/icons/settings.png')} style={{ width: 35, height: 35 }} />
          <Text style={styles.boxText}>Settings </Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Help')}>
          <Image source={require('../../Assets/icons/help.png')} style={{ width: 35, height: 35 }} />
          <Text style={styles.boxText}>Help</Text>
        </TouchableOpacity> */}

      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('CheckIn')}>
          <Image source={require('../../Assets/icons/check.png')} style={{ width: 35, height: 35 }} />
          <Text style={styles.boxText}>Check In </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Help')}>
          <Image source={require('../../Assets/icons/seo-report.png')} style={{ width: 35, height: 35 }} />
          <Text style={styles.boxText}>Report</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.row}>
        {/* <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Notice')}>
          <Image source={require('../../Assets/icons/board.png')} style={{ width: 35, height: 35 }} />
          <Text style={styles.boxText}>Notice Board</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.box} onPress={logout}>
          <Image source={require('../../Assets/icons/log-out.png')} style={{ width: 35, height: 35 }} />
          <Text style={styles.boxText}>Log Out</Text>
        </TouchableOpacity>


      </View>
      <View style={styles.row}>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    // justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  box: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  fullWidthBox: {
    flex: 1.5,
    backgroundColor: '#28a745',
  },
  boxText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  filterButton: {
    marginRight: 15,
  },
  boxnumber: {
    fontWeight: 'bold',
    fontSize: 17
  },
  backButton: {
    marginLeft: 15
  }
});