import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';



const MasterSetting = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { user, token } = useAuth()

  const [measurements, setMeasurements] = useState([]);
  const [project, setProject] = useState([])
  const [leadSources, setLeadSources] = useState([]);
  const [archivedReasons, setArchivedReasons] = useState([]);


  useEffect(() => {
    if (isFocused) {
      getData(); // Runs every time screen comes into focus
    }
  }, [isFocused]);

  const getData = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/view-master-setting", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === 200) {
        const allData = res.data.data;

        setMeasurements(allData.filter(item => item.cat_name === "Require Measurement"));
        setLeadSources(allData.filter(item => item.cat_name === "Lead Source"));
        setArchivedReasons(allData.filter(item => item.cat_name === "Archived Reason"));
        setProject(allData.filter(item => item.cat_name === "Project"));
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };




  // Delete function to remove an item from the list
  const handleDelete = (id) => {
    Alert.alert(
      "Delete",
      "Do you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => confirmDelete(id), // perform delete only on OK
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDelete = async (id) => {
    try {
      const response = await axios.get(
        `https://api.almonkdigital.in/api/admin/delete-master-setting/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // console.log("Deleted successfully");
        Alert.alert("Success", "Item deleted");
        getData(); // refresh data after deletion
      } else {
        Alert.alert("Error", "Deletion failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity> */}
        <Text style={styles.headerText}>Master Setting</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddMasterSetting")} style={styles.admin}>
          {/* Uncomment and update if you have an "Add User" button */}
          <Image source={require('../../Assets/icons/add-friend.png')} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      </View>

      {/* FlatList to render the table rows */}

      <View style={styles.border}>
        <Text style={styles.text}>Requirment</Text>
        <FlatList
          data={measurements}
          // keyExtractor={(item) => item.id}  // Using unique 'id' as the key
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text>{item.cat_value}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={24} color="white" />

                </TouchableOpacity>
              </View>
            </View>

          )}
        />
      </View>


      <View style={styles.border}>
        <Text style={styles.text}>Project</Text>
        <FlatList
          data={project}
          // keyExtractor={(item) => item.id}  // Using unique 'id' as the key
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text>{item.cat_value}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={24} color="white" />

                </TouchableOpacity>
              </View>
            </View>

          )}
        />
      </View>
      <View style={styles.border}>
        <Text style={styles.text}>Lead Source</Text>
        <FlatList
          data={leadSources}
          // keyExtractor={(item) => item.id}  // Using unique 'id' as the key
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text>{item.cat_value}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={24} color="white" />

                </TouchableOpacity>
              </View>
            </View>

          )}
        />
      </View>
      <View style={[styles.border, styles.lastSection]} >
        <Text style={styles.text}>Archived Reason</Text>
        <FlatList
          data={archivedReasons}
          // keyExtractor={(item) => item.id}  // Using unique 'id' as the key
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text>{item.cat_value}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={24} color="white" />

                </TouchableOpacity>
              </View>
            </View>

          )}
        />
      </View>
    </ScrollView>
  );
};

export default MasterSetting;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1", padding: 10,marginBottom:40 },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "red", padding: 15, borderRadius: 10, marginBottom: 15 },
  backButton: { marginRight: 10 },
  headerText: { color: "white", fontSize: 14, },
  tableRow: { flexDirection: "row", elevation: 3, backgroundColor: "#fff", padding: 5, margin: 5, borderRadius: 10, justifyContent: "space-around" },
  cell: { flex: 1, fontSize: 16, fontWeight: 600, textAlign: "center", padding: 5 },
  readMoreButton: { padding: 10, alignItems: "center" },
  icon: { marginLeft: 10 },
  actionButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 0 },
  updateButton: { flexDirection: "row", alignItems: "center", backgroundColor: "green", padding: 3, borderRadius: 5, marginRight: 6 },
  deleteButton: { flexDirection: "row", alignItems: "center", backgroundColor: "red", padding: 3, borderRadius: 5 },
  updateText: { color: "white", marginLeft: 5, fontWeight: "bold" },
  deleteText: { color: "white", marginLeft: 5, fontWeight: "bold" },
  pagination: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { backgroundColor: "red", padding: 10, borderRadius: 10, width: 100, alignItems: "center" },
  disabledButton: { backgroundColor: "#b2b2b2" },
  buttonText: { color: "white", fontWeight: "bold" },
  firstdata: { flexDirection: "row", justifyContent: "center" },
  admin: { position: "absolute", right: 20 },
  detailedInfo: { backgroundColor: "#f3f3f3", padding: 5, marginTop: 10, borderRadius: 10, width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around" },
  extraText: { fontSize: 14, color: "#333", marginBottom: 5 },
  text: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: 600
  },
  border: {
    borderWidth: 1,
    elevation: 3, backgroundColor: "#fff", padding: 5, margin: 5, borderRadius: 10,
    borderColor: "#b2b2b2"
  },
  lastSection:{
    marginBottom:40
  }
});
