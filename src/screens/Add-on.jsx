import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';

const Addon = ({ navigation }) => {
  const { user, token } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [requirement, setRequirement] = useState('');

 useLayoutEffect(() => {
  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    ),

    // ✅ HEADER RIGHT BUTTON WAPAS ADD
    headerRight: () => (
      <TouchableOpacity 
        onPress={() => navigation.navigate("Filter")} 
        style={styles.filterButton}
      >
        <Ionicons name="filter-outline" size={24} color="black" />
      </TouchableOpacity>
    ),

    title: "Add On Client",
    headerStyle: { backgroundColor: "#f5f5f5" },
    headerTitleStyle: { fontSize: 20 },
  });
}, [navigation]);

  const handleSubmit = async () => {
    if (!name || !phone || !city || !budget || !requirement) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
  const  res=  await ApiClient.post(
        "/addons-client",
        {
          user_id: user.user_id,
          name,
          phone,
          city,
          budget,
          requirement,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
if(res.data.status===200){
 Alert.alert("Success", res.data.message);

      setName('');
      setPhone('');
      setCity('');
      setBudget('');
      setRequirement('');
}
     

    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add On Client</Text>

      {/* Name */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Phone */}
   <View style={styles.inputContainer}>
  <Ionicons name="call-outline" size={20} color="#555" />
  <TextInput
    style={styles.input}
    placeholder="Phone"
    keyboardType="number-pad"
    maxLength={10}   // ✅ max 10 digits
    value={phone}
    onChangeText={(text) => {
      // ✅ Sirf numbers allow
      const cleaned = text.replace(/[^0-9]/g, '');
      setPhone(cleaned);
    }}
  />
</View>

      {/* City */}
      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
      </View>

      {/* Budget */}
     <View style={styles.inputContainer}>
  <Ionicons name="cash-outline" size={20} color="#555" />
  <TextInput
    style={styles.input}
    placeholder="Budget"
    keyboardType="number-pad"
    value={budget}
    onChangeText={(text) => {
      // ✅ Sirf numbers allow
      const cleaned = text.replace(/[^0-9]/g, '');
      setBudget(cleaned);
    }}
  />
</View>

      {/* Requirement */}
      <View style={[styles.inputContainer, { alignItems: 'flex-start' }]}>
        <Ionicons
          name="document-text-outline"
          size={20}
          color="#555"
          style={{ marginTop: 12 }}
        />
        <TextInput
          style={[styles.input, styles.requirementInput]}
          placeholder="Requirement"
          multiline
          textAlignVertical="top"   // 🔥 Important (Android)
          value={requirement}
          onChangeText={setRequirement}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Addon;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },

  requirementInput: {
    height: 120,
  },

  button: {
    backgroundColor: '#003961',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  backButton: {
    marginLeft: 10,
  },
   filterButton: {
    marginRight: 10
  },
});