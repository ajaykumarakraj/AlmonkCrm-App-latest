import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddMasterSetting = ({ navigation }) => {
  const { user, token } = useAuth()
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");



  // Data for categorydata options
  const categorydata = [

    { value: 'Require Measurement' },
    { value: 'Lead Source' },
    { value: 'Archived Reason' },
  ];
  const handleSave = async () => {
    if (!category || !value) return alert("Please select a category and enter a value.");
    try {
      res = await axios.post("http://api.almonkdigital.in/api/admin/add-master-setting",
        {
          category_name: category,
          category_value: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // console.log(res.data)
      navigation.goBack();
    } catch (error) {
      console.log(error)
    }


  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add MasterSetting</Text>
      </View>
      {/* Agent data (without search) */}
      <View style={styles.pickerWrapper}>
        <SelectList
          data={categorydata}
          setSelected={setCategory}
          placeholder="Select"
          placeholderTextColor="#000"
          search={false}  // Disable search
        />
      </View>
      <TextInput style={styles.input} value={value} onChangeText={setValue} placeholder="Enter value" />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddMasterSetting;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003961",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    elevation: 3,
  },
  pickerWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden', // Ensures no parts of the picker go outside the container
  },
  button: {
    backgroundColor: "#003961",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});


