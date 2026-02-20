import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import ApiClient from "../component/ApiClient";
import { useAuth } from "../context/AuthContext";

const AddClientScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { user, token } = useAuth();

  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [number, setNumber] = useState("");
  const [altnumber, setAltnumber] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");
  const [selectcustomer, setSelectcustomer] = useState("");
  const [requirement, setRequirement] = useState("");
  const [leadsourcelist, setLeadsourceList] = useState([])
  const [leadsource, setLeadsource] = useState("");


  const [projectList, setProjectList] = useState([])
  const [project, setProject] = useState("");
  const [teamleaderList, setTeamleaderList] = useState([]);
  const [teamleader, setTeamleader] = useState("");
  const [agentList, setAgentList] = useState([]);
  const [agent, setAgent] = useState("");
  const [statedata, setStatedata] = useState([]);
  const [requireList, setRequireList] = useState([]);
  const [text, setText] = useState('');

  const genderData = [
    { value: "Male" },
    { value: "Female" },
    { value: "Other" },
  ];

  const customerselectData = [
    { value: "Dealer" },
    { value: "Customer" },
  ];

  // const leadsourceData = [
  //   { value: "Facebook" },
  //   { value: "Instagram" },
  // ];

  // const projectData = [
  //   { key: "1", value: "Golden Enclave" },
  //   { key: "2", value: "Golden Enclave 23k Square" },
  //   { key: "3", value: "Golden Home" },
  //   { key: "4", value: "Golden Home 3 Lac" },
  // ];

  const onRefresh = () => {
    setRefreshing(true);
    fetchInitialData();
    setTimeout(() => setRefreshing(false), 1500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Filter")}
          style={styles.filterButton}
        >
          <Ionicons name="filter-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      title: "Add New Client",
      headerStyle: { backgroundColor: "#f5f5f5" },
      headerTitleStyle: { fontSize: 20 },
    });
  }, [navigation]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    fetchStates();
    fetchRequirements();
    fetchTeamLeaders();
  };

  const fetchStates = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/state-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setStatedata(res.data.data.map((s) => ({ value: s.state })));
      }
    } catch (error) {
      console.log("State fetch error:", error);
    }
  };

  const fetchRequirements = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/view-master-setting", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setRequireList(
          res.data.data
            .filter((item) => item.cat_name === "Require Measurement")
            .map((item) => ({ value: item.cat_value }))
        );
        setLeadsourceList(
          res.data.data
            .filter((item) => item.cat_name === "Lead Source")
            .map((item) => ({ value: item.cat_value }))
        );
        setProjectList(
          res.data.data
            .filter((item) => item.cat_name === "Project")
            .map((item) => ({ value: item.cat_value }))
        );
      }
    } catch (error) {
      console.log("Requirement fetch error:", error);
    }
  };

  const fetchTeamLeaders = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/get-team-leader", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setTeamleaderList(res.data.data.map((tl) => ({ key: tl.user_id.toString(), value: tl.name })));
      }
    } catch (error) {
      console.log("Team leader fetch error:", error);
    }
  };

  const handleTeamLeaderSelect = async (id) => {
    setTeamleader(id);
    try {
      const res = await axios.get(`https://api.almonkdigital.in/api/admin/get-agent/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setAgentList(res.data.data.map((ag) => ({ key: ag.id.toString(), value: ag.name })));
      }
    } catch (error) {
      console.log("Agent fetch error:", error);
    }
  };

  const handleSave = async () => {
    try {
      const formData = {
        user_id: user.user_id,
        name,
        contact: number,
        alt_contact: altnumber,
        gender: selectedGender,
        state: selectedState,
        city,
        requirement,
        lead_source: leadsource,
        customer_type: selectcustomer,
        project,
        remark: text,
        team_leader: teamleader,
        agent,
      };
      // console.log(formData)
      const res = await ApiClient.post("/create-customer", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Client added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Failed to add client. Please try again.");
    }
  };
  // console.log(selectedState)
  // console.log(statedata)
  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ paddingBottom: 100 }}>
        <Text style={styles.sectionHeader}>Basic Information</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#000" />
        <View style={styles.pickerWrapper}><SelectList data={genderData} setSelected={setSelectedGender} placeholder="Gender" search={false} /></View>

        <Text style={styles.sectionHeader}>Contact Details</Text>
        <TextInput style={styles.input} value={number} onChangeText={setNumber} placeholder="Mobile No." keyboardType="numeric" placeholderTextColor="#000" />
        <TextInput style={styles.input} value={altnumber} onChangeText={setAltnumber} placeholder="Alt Mobile No." keyboardType="numeric" placeholderTextColor="#000" />

        <Text style={styles.sectionHeader}>Location</Text>
        <View style={styles.pickerWrapper}><SelectList data={statedata} setSelected={setSelectedState} placeholder="Select State" search={false} /></View>
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Enter City" placeholderTextColor="#000" />

        <Text style={styles.sectionHeader}>Client Type & Requirement</Text>
        <View style={styles.pickerWrapper}><SelectList data={customerselectData} setSelected={setSelectcustomer} placeholder="Customer Type" search={false} /></View>
        <View style={styles.pickerWrapper}><SelectList data={requireList} setSelected={setRequirement} placeholder="Requirement" search={false} /></View>

        <Text style={styles.sectionHeader}>Lead Source & Project</Text>
        <View style={styles.pickerWrapper}><SelectList data={leadsourcelist} setSelected={setLeadsource} placeholder="Lead Source" search={false} /></View>
        <View style={styles.pickerWrapper}><SelectList data={projectList} setSelected={setProject} placeholder="Project" search={false} /></View>

        <Text style={styles.sectionHeader}>Team & Agent</Text>
        <View style={styles.pickerWrapper}><SelectList data={teamleaderList} setSelected={handleTeamLeaderSelect} placeholder="Team Leader" search={false} /></View>
        <View style={styles.pickerWrapper}><SelectList data={agentList} setSelected={setAgent} placeholder="Agent" search={false} /></View>

        <Text style={styles.sectionHeader}>Remark</Text>
        <TextInput style={styles.textArea} multiline numberOfLines={4} value={text} onChangeText={setText} placeholder="Enter your remarks here..." placeholderTextColor="#999" />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddClientScreen;

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  filterButton: {
    marginRight: 15,
  },
  backButton: {
    marginLeft: 15,
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
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#003961",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 14,
    elevation: 3,
    height: 100,
    marginBottom: 15,
  },
});
