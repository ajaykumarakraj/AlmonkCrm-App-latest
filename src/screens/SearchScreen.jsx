import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Header } from '@react-navigation/elements';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiClient from '../component/ApiClient';

const SearchScreen = ({ navigation }) => {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState('')

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
      title: "Search",
      headerStyle: { backgroundColor: "#f5f5f5" },
      headerTitleStyle: { fontSize: 20, },
    });
  }, [navigation]);
  const handleSearch = async () => {

    try {

      // console.log('Searching for:', searchQuery);
      const res = await ApiClient.post("/search", { user_id: `${user.user_id}`, search_value: searchQuery }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setResult(res.data)
      // console.log("res.dataid", res.data)
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Something went wrong during search.");
    }


  };
  const renderItem = ({ item }) => (
    <View style={styles.row}>

      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.contact}</Text>
      <TouchableOpacity
  disabled={!(item.enable_edit === true || user?.role === "Admin")}
  onPress={() => {
    if (item.enable_edit === true || user?.role === "Admin") {
      navigation.navigate('UpdateScreen', { userSearchdata: item.id })
    }
  }}
>
  <Text style={styles.cell}>
    {(item.enable_edit === true || user?.role === "Admin")
      ? <Image source={require("../../Assets/icons/write.png")} style={{ height: 20, width: 20 }} />
      : <Image source={require("../../Assets/icons/edit.png")} style={{ height: 20, width: 20 }} />
    }
  </Text>
</TouchableOpacity>
    </View>
  )
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Search Screen</Text> */}

      <TextInput
        style={styles.input}
        placeholder="Enter search keyword"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>



      {/* <Text style={styles.heading}>User Table</Text> */}
      <FlatList
        data={result.data}
        renderItem={renderItem}
      // keyExtractor={(item => item.id)}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#003961',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 4,
    fontSize: 14,
  },
  header: {
    backgroundColor: '#003961',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterButton: {
    marginRight: 10
  },
  backButton: {
    marginLeft: 10
  }
});
