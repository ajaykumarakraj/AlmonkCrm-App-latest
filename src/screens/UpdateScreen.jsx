import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Button,
  Platform,
  Image,
  Linking
} from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import ApiClient from "../component/ApiClient";
import { useAuth } from "../context/AuthContext";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { RefreshControl } from 'react-native';
const UpdateScreen = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  // const { user } = route.params;
  const { userSearchdata } = route.params;
  const { user, token } = useAuth();
  const [formMode, setFormMode] = useState("customer");
  // const [userdata, setUser] = useState("");
  // name and gender
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  // number
  const [number, setNumber] = useState("");
  const [altnumber, setAltnumber] = useState("");
  // city
  const [selectedState, setSelectedState] = useState([]);
  const [getState, setGetState] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  // requireList
  const [requireList, setRequireList] = useState([]);
  const [requirement, setRequirement] = useState("");
  // teamleader 
  const [teamleaderlist, setTeamleaderList] = useState([]);
  const [teamLeaderId, setTeamLeaderId] = useState("")
  const [teamLeader, setTeamLeader] = useState("");
  //Agent
  const [agentlist, setAgentList] = useState([]);
  const [agentid, setAgentId] = useState("");
  const [agentget, setGetAgent] = useState([]);
  // project 
  const [project, setProject] = useState("");
  const [projectlist, setProjectList] = useState([])
  // lead source
  const [leadsourcelist, setLeadSourceList] = useState([])
  const [selectCustomer, setSelectCustomer] = useState("");
  const [leadSource, setLeadSource] = useState("");

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

const [status, setStatus] = useState(null);
  // Notes update
  const [siteVisitDate, setSiteVisitDate] = useState(null);
  const [houseVisitDate, setHouseVisitDate] = useState(null);
  const [officeVisitDate, setOfficeVisitDate] = useState(null);
  // const [midwayVisitDate, setMidwayVisitDate] = useState(null);
  const [showSitePicker, setShowSitePicker] = useState(false);
  const [showHousePicker, setShowHousePicker] = useState(false);
  const [showOfficePicker, setShowOfficePicker] = useState(false);
  // const [showMidwayPicker, setShowMidwayPicker] = useState(false);


  const [isPickerVisible, setPickerVisible] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [error, setError] = useState('');
  const [call, setCall] = useState("");

  // const [call_captured, setCallNumber] = useState("");

  const [lead, setLead] = useState("");
  const [leadkey, setLeadKey] = useState("")
  const [data, setData] = useState("");
  // call action 
  const [Callstatus, setCallStatus] = useState("");
  const [callAction, setCallAction] = useState("");

  // const [date, setDate] = useState(new Date());
  // const [mode, setMode] = useState('date'); // 'date' or 'time'
  // const [show, setShow] = useState(false);

  // Dropdown Data   
  const genderData = [
    { key: "1", value: "Male" },
    { key: "2", value: "Female" },
    { key: "3", value: "Other" },
  ];
  const customerTypeData = [
    { key: "1", value: "Dealer" },
    { key: "2", value: "Customer" },
  ];


  const callstatus = [
    { value: "Connect" },
    { value: "Not Connect" },
  ];
  const leadstatus = [
    { key: "1", value: "New Lead" },
    { key: "2", value: "In Progress" },
    { key: "3", value: "Hot Lead" },
    { key: "4", value: "Archived" },
    { key: "5", value: "Converted" },

  ];


  const connectedOptions = [
    'on calls',
    'WhatsApp',
    'Not Interested',
    'Fake Query',
    'Hung Up',
    'Wrong Number',
  ];

  const notConnectedOptions = [
    'Not Pick Up',
    'Not Reachable',
    'Number Busy',
    'Number Blocked',
    'Incoming Unavailable',
    'Other',
  ];
  const onRefresh = () => {
    setRefreshing(true);
    // numData(); // ✅ fixed
    setTimeout(() => setRefreshing(false), 1500);
  };
  const getActionOptions = () => {
    if (Callstatus === 'Connect') return connectedOptions;
    if (Callstatus === 'Not Connect') return notConnectedOptions;
    return [];
  };
  const handleCallStatus = (selectedValue) => {
    setCallStatus(selectedValue);
    setCallAction(''); // reset dependent field
    // setFollowUpDate(''); // if needed
  };
  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);
  const handleConfirm = (date) => {

    // console.log("Selected DateTime:", moment(date).format('YYYY-MM-DD hh:mm A')); // ✅ log only
    setDateTime(date); // ✅ keep Date object in state
    hidePicker();
  };

  useEffect(() => {
    fetchStates();
    noteData();
    getData();
    fetchRequirements();
    fetchTeamLeaders();
  }, []);
  const fetchStates = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/state-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setGetState(res.data.data.map((s) => ({ value: s.state })));
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
        setProjectList(
          res.data.data
            .filter((item) => item.cat_name === "Project")
            .map((item) => ({ value: item.cat_value }))
        );
        setLeadSourceList(
          res.data.data
            .filter((item) => item.cat_name === "Lead Source")
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
  const getData = async () => {
    try {
      const res = await ApiClient.get(`/update-lead-data/${userSearchdata}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.data.status === 200) {

        const fetchedUser = res.data.data;
        // console.log("run")
        // console.log("all data", fetchedUser)
        setName(fetchedUser.name)
        setNumber(fetchedUser.contact)
        setSelectedGender(fetchedUser.gender)
        setAltnumber(fetchedUser.alt_contact)
        setSelectedState(fetchedUser.state)
        setTeamLeaderId(fetchedUser.assign_team_leader_id)
        setAgentId(fetchedUser.assign_agent_id)
        setLeadSource(fetchedUser.lead_source)
        setLead(fetchedUser.lead_status)
        setLeadKey(fetchedUser.lead_key)
        setSelectedCity(fetchedUser.city)
        setSelectCustomer(fetchedUser.customer_type)
        setRequirement(fetchedUser.requirement)
        setProject(fetchedUser.project_id)
        setTeamLeader(res.data.tl_name)
        setGetAgent(res.data.agent_name)
        // setAgentList(res.data.agent_data.map((v) => ({ key: v.agent_id, value: v.agent_name })))


        // setAgentId(res.data.agent_data.agent_id)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const noteData = async () => {
    try {
      const res = await ApiClient.get(`/get-lead-notes/${userSearchdata}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.data.status === 200) {
        setData(res.data.data);
        console.log("get note", res.data.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
const handleDateChange = (setter, setShow) => (event, selectedDate) => {
  
  // Android: close picker first
  if (Platform.OS === "android") {
    setShow(false);
  }

  // 🔥 Agar cancel hua to kuch mat karo
  if (event?.type !== "set") {
    return;
  }

  // Sirf OK pe hi date set karo
  if (selectedDate) {
    setter(selectedDate);
  }
};
  const renderDateText = (date) => date ? date.toLocaleDateString() : 'Select date';

  const formattedDate = dateTime ? moment(dateTime).format('YYYY-MM-DD HH:mm:ss') : "";
  const handleSaveNote = async () => {

    // console.log("date:", formattedDate)
    // console.log("Call status:", Callstatus)
    // console.log("last Call Action:", callAction)
    // console.log("lead:", lead)

    // Rule 1: Require follow-up date if not archived and no call status selected
    if (lead !== '4' && !formattedDate && !Callstatus == "0") {
      setError('Follow-Up Date is required unless the lead is Archived.');
      return;
    }

    // Rule 2: Require call action if call status is selected
    if (Callstatus && !callAction) {
      setError('Call Action is required when Call Status is selected.');
      return;
    }

    // If everything is valid
    setError('');

    Alert.alert('Saved!', 'Your visit dates and notes has been update')

    try {
      const updatedUser = {
        user_id: user.user_id,
        id: userSearchdata,
        notes: notes,
        site_visit: siteVisitDate,
        house_visit: houseVisitDate,
        office_visit: officeVisitDate,
        // mid_way_visit: midwayVisitDate,
        call_status: call,
        follow_up: formattedDate,
        last_call_action: callAction,
        lead_status: leadkey,
        remark: "",
        team_leader: teamLeaderId,
        agent: agentid

      };
      // console.log("notes data", updatedUser)
      const res = await ApiClient.post(
        "/save-lead-notes",
        updatedUser,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Success:", res.data);
      Alert.alert("Success", "Client updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Failed to update client. Please try again.");
    } finally {
      setLoading(false);
    }


  };
  const handleSave = async () => {
    if (!name || !number) {
      Alert.alert("Validation Error", "Name and Mobile Number are required.");
      return;
    }

    setLoading(true);

    try {
      const updatedUser = {
        user_id: user.user_id,
        id: userSearchdata,
        name,
        contact: number,
        alt_contact: altnumber,
        gender: selectedGender,
        state: selectedState,
        city: selectedCity,
        requirement,
        lead_source: leadSource,
        customer_type: selectCustomer,
        project,
        remark: "No Remark",
        team_leader: teamLeaderId,
        agent: agentid
      };
      // console.log("post", updatedUser)
      const res = await ApiClient.post(
        "/save-update-lead-data",
        updatedUser,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("post res",res)
      if (res.status == 200) {
        // console.log("Success:", res.data);
        Alert.alert("Success", "Client updated successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Failed to update client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSaveNotes = () => {
  //   Alert.alert("Notes Saved", notes || "No notes entered.");
  //   // You can send 'notes' and 'date' to backend here
  // };



  const onselectteamleader = async (id) => {
    // console.log("teamlederid", id)
    setTeamLeaderId(id)
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
  // console.log("lead user", user.user_id)
  // console.log("data note", data)


  // console.log("date", dateTime)


// bussiness whatsapp 



const handleBussinessWhatsapp = async () => {
  try {
    const postkey = {
      id: userSearchdata,
      user_id: user.user_id,
      team_leader: teamLeaderId,
      agent: agentid,
      call_captured: "whatsapp"
    };

    // 🔥 API CALL
    const reswhatsapp = await axios.post(
      "https://api.almonkdigital.in/api/call-capture",
      postkey,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (reswhatsapp.status === 200) {

      // 🔥 Number clean karo
      const phone = number.replace(/[^0-9]/g, "");

      const message = "Hello, regarding your enquiry.";

      // 🔥 Direct WhatsApp App Open
      const url = `whatsapp://send?phone=91${phone}&text=${encodeURIComponent(message)}`;

      await Linking.openURL(url);
    }

  } catch (error) {
    console.log("WhatsApp Error:", error);
    Alert.alert("Error", "WhatsApp not installed or API failed");
  }
};

  const handleCall = async () => {
    try {

      const postkey = {
        id: userSearchdata,
        user_id: user.user_id,
        team_leader: teamLeaderId,
        agent: agentid,
        call_captured: "Call"
      }
      // console.log("postkey", postkey)
      const reswhatsapp = await axios.post("https://api.almonkdigital.in/api/call-capture", postkey, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (reswhatsapp.status == 200) {

        const url = `tel:${number}`;
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error)
    }
  }

// side compelete or not api 

const completeside = () => {
  Alert.alert(
    "Confirm",
    "Kya aap site visit Complete mark karna chahte hain?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            setLoading(true);

            const res = await api.post(
              "/update-site-visit",   
              {
                id: item.id,            
                status: "complete"
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              }
            );

            if (res.status === 200) {
              Alert.alert("Success", "Site visit marked as complete");
              
              // agar state update karni ho
              setStatus("complete");

              // agar data refresh karna ho
              // getsearchdata(currentPage);
            }

          } catch (error) {
            Alert.alert("Error", "Something went wrong");
          } finally {
            setLoading(false);
          }
        }
      }
    ]
  );
};

const notcomplete = () => {
  Alert.alert(
    "Confirm",
    "Kya aap site visit Not Complete mark karna chahte hain?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => setStatus("notcomplete")
      }
    ]
  );
};
//end side compelete or not api 

  // console.log(whatsapp)
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Customer Details</Text>
        </View> */}

        <View style={styles.switchButtons}>
          <View style={{ width: "50%" }}>
            <Button

              title="Customer"
              onPress={() => setFormMode("customer")}
              color={formMode === "customer" ? "#003961" : "#888"}
            />
          </View>
          <View style={{ width: "50%" }}>
            <Button
              title="Notes"
              onPress={() => setFormMode("notes")}
              color={formMode === "notes" ? "#003961" : "#888"}
            />
          </View>
        </View>

        {formMode === "customer" ? (
          <>
            <Text style={styles.textlavel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />

            <Text style={styles.textlavel}>Mobile No.</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
              placeholder="Mobile No."
              keyboardType="numeric"
            />

            <Text style={styles.textlavel}>Alternate Mobile No.</Text>
            <TextInput
              style={styles.input}
              value={altnumber}
              onChangeText={setAltnumber}
              placeholder={altnumber}
              keyboardType="numeric"
              placeholderTextColor="#000"
            />

            <Text style={styles.textlavel}>Gender</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={genderData}
                setSelected={setSelectedGender}
                placeholder={selectedGender}
                save="value"
                search={false}
                defaultValue={selectedGender}
              />
            </View>
            <Text style={styles.textlavel}>State</Text>
            {/* <View style={styles.pickerWrapper}><SelectList   placeholder="Select State" search={false} /></View> */}
            <View style={styles.pickerWrapper}>
              <SelectList
                // data={cityData}
                setSelected={setSelectedState}
                data={getState}
                placeholder={selectedState}
                save="value"
                search={false}
                defaultValue={selectedState}
              />
            </View>
            <Text style={styles.textlavel}>City</Text>
            <TextInput
              style={styles.input}
              value={selectedCity}
              onChangeText={setSelectedCity}
              placeholder={selectedCity}

              placeholderTextColor="#000"
            />


            <Text style={styles.textlavel}>Customer Type</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={customerTypeData}
                setSelected={setSelectCustomer}
                placeholder={selectCustomer}
                save="value"
                search={false}
                defaultValue={selectCustomer}
              />
            </View>

            <Text style={styles.textlavel}>Requirement</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={requireList}
                setSelected={setRequirement}
                placeholder={requirement}
                save="value"
                search={false}
                defaultValue={requirement}
              />
            </View>

            <Text style={styles.textlavel}>Lead Source</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={leadsourcelist}
                setSelected={setLeadSource}
                placeholder={leadSource}
                save="value"
                search={false}
                defaultValue={leadSource}
              />
            </View>

            <Text style={styles.textlavel}>Project</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={projectlist}
                setSelected={setProject}
                placeholder={project}
                save="value"
                search={false}
                defaultValue={project}
              />
            </View>

            <Text style={styles.textlavel}>Team Leader</Text>

            <View style={styles.pickerWrapper}>
              {(user?.role === "Agent" || user?.role === "Team Leader") ? (
                <Text style={styles.disabledText}>{teamLeader || "N/A"}</Text>
              ) : (
                <SelectList
                  data={teamleaderlist}
                  setSelected={onselectteamleader}
                  placeholder={teamLeader}
                  // save="value"
                  search={false}
                  defaultValue={teamLeader}
                />
              )}
            </View>
            <Text style={styles.textlavel}>Agent</Text>
            <View style={styles.pickerWrapper}>
              {user?.role === "Agent" ? (
                <Text style={styles.disabledText}>{agentget || "N/A"}</Text>
              ) : (
                <SelectList
                  data={agentlist}
                  setSelected={setAgentId}
                  placeholder={agentget}
                  // save="value"
                  search={false}
                  defaultValue={agentget}
                />
              )}
            </View>


            {loading ? (
              <ActivityIndicator size="large" color="#003961" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <Text>Notes</Text>
            <View style={styles.scrollBox}>

              <ScrollView style={{ maxHeight: 200, }} nestedScrollEnabled={true}>
                {data.length === 0 ? (
                  <Text style={styles.loadingText}>Loading...</Text>
                ) : (
                  data.map((item, index) => (
                    <View key={index} style={styles.remarkBox}>
                      {item.notes?.trim() ? (
                        <Text style={styles.notetext}> {item.notes}</Text>
                      ) : null}

                      {item.call_status?.trim() ? (
                        <Text style={styles.notetext}> {item.call_status}</Text>
                      ) : null}
                      {item.house_visit?.trim() ? (
                        <Text style={styles.notetext}> {item.house_visit}</Text>
                      ) : null}
                      {item.last_call_action?.trim() ? (
                        <Text style={styles.notetext}> {item.last_call_action}</Text>
                      ) : null}
                      {item.lead_status?.trim() ? (
                        <Text style={styles.notetext}> {item.lead_status}</Text>
                      ) : null}
                      {item.midmid_way_visit?.trim() ? (
                        <Text style={styles.notetext}> {item.midmid_way_visit}</Text>
                      ) : null}
                      {item.office_visit?.trim() ? (
                        <Text style={styles.notetext}> {item.office_visit}</Text>
                      ) : null}
                      {item.site_visit?.trim() ? (
                        <Text style={styles.notetext}> {item.site_visit}</Text>
                      ) : null}
                      {item.call_captured?.trim() ? (
                        <Text style={styles.notetext}> {item.call_captured}</Text>
                      ) : null}
                      {item.whats_app?.trim() ? (
                        <Text style={styles.notetext}> {item.whats_app}</Text>
                      ) : null}
                      {item.tl_remark?.trim() ? (
                        <Text style={styles.notetext}> {item.tl_remark}</Text>
                      ) : null}
                      {item.agent_remark?.trim() ? (
                        <Text style={styles.notetext}> {item.agent_remark}</Text>
                      ) : null}
                      {item.lead_remark?.trim() ? (
                        <Text style={styles.notetext}> {item.lead_remark}</Text>
                      ) : null}
                      {item.by?.trim() ? (
                        <Text style={styles.notetext}> {item.by}</Text>
                      ) : null}
                    </View>
                  ))
                )}
              </ScrollView>
            </View>


            <View style={styles.social}>
              <Text style={{ fontSize: 16 }}>Enter Notes</Text>
              <View style={styles.icon}>
                <TouchableOpacity onPress={handleBussinessWhatsapp}>
                  <Image
                    source={require('../../Assets/icons/whatsapp.png')}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={handleWhatsapp}>
                  <Image
                    source={require('../../Assets/icons/whatsapp.png')}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={handleCall}>
                  <Image
                    source={require('../../Assets/icons/phone-call.png')}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity></View>
            </View>

            <TextInput
              style={styles.textArea}
              placeholder="Enter your notes here..."
              multiline={true}
              numberOfLines={6}
              value={notes}
              onChangeText={setNotes}
            />
<View style={styles.schedule}>
  <Text style={styles.label}>Schedule Site Visit</Text>

  <View style={styles.statusadd}>
    
    <TouchableOpacity 
      style={[
        styles.iconButton,
        status === "complete" && styles.activeComplete
      ]}
      onPress={completeside}
    >
      <Icon 
        name="check-circle" 
        size={22} 
        color={status === "complete" ? "green" : "green"} 
      />
    </TouchableOpacity>

    <TouchableOpacity 
      style={[
        styles.iconButton,
        status === "notcomplete" && styles.activeNotComplete
      ]}
      onPress={notcomplete}
    >
      <Icon 
        name="cancel" 
        size={22} 
        color={status === "notcomplete" ? "red" : "red"} 
      />
    </TouchableOpacity>

  </View>
</View>
            





            <TouchableOpacity onPress={() => setShowSitePicker(true)} style={styles.dateButton}>
              <Text style={[styles.dateText, !siteVisitDate && styles.placeholder]}>{renderDateText(siteVisitDate)}</Text>
            </TouchableOpacity>
            {showSitePicker && (
              <DateTimePicker
                value={siteVisitDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange(setSiteVisitDate, setShowSitePicker)}
              />
            )}

            <Text style={styles.label}>House Visit Completed</Text>
            <TouchableOpacity onPress={() => setShowHousePicker(true)} style={styles.dateButton}>
              <Text style={[styles.dateText, !houseVisitDate && styles.placeholder]}>{renderDateText(houseVisitDate)}</Text>
            </TouchableOpacity>
            {showHousePicker && (
              <DateTimePicker
                value={houseVisitDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange(setHouseVisitDate, setShowHousePicker)}
              />
            )}

            <Text style={styles.label}>Office Visit Completed</Text>
            <TouchableOpacity onPress={() => setShowOfficePicker(true)} style={styles.dateButton}>
              <Text style={[styles.dateText, !officeVisitDate && styles.placeholder]}>{renderDateText(officeVisitDate)}</Text>
            </TouchableOpacity>
            {showOfficePicker && (
              <DateTimePicker
                value={officeVisitDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange(setOfficeVisitDate, setShowOfficePicker)}
              />
            )}

            {/* <Text style={styles.label}>Mid Way Visit Completed</Text>
            <TouchableOpacity onPress={() => setShowMidwayPicker(true)} style={styles.dateButton}>
              <Text style={[styles.dateText, !midwayVisitDate && styles.placeholder]}>{renderDateText(midwayVisitDate)}</Text>
            </TouchableOpacity>
            {showMidwayPicker && (
              <DateTimePicker
                value={midwayVisitDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange(setMidwayVisitDate, setShowMidwayPicker)}
              />
            )} */}

            <Text style={styles.label}>Call Status</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={callstatus}
                setSelected={handleCallStatus}
                placeholder="Select Call Status"
                save="value"
                search={false}
                defaultValue={call}
              />
            </View>
            {error && (
              <View >
                <Text> {error}</Text>
              </View>
            )}
            {Callstatus && (
              <View>
                <Text style={styles.label}>Follow Up</Text>

                <TouchableOpacity style={styles.button} onPress={showPicker}>
                  <Text style={styles.buttonText}>
                    📅 {dateTime ? moment(dateTime).format('DD-MM-YYYY') : 'Pick a date'} ⏰ {dateTime ? moment(dateTime).format('hh:mm A') : ''}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isPickerVisible}
                  mode="datetime"
                  date={dateTime || new Date()} // required, fallback won't be saved
                  onConfirm={(date) => {
                    setDateTime(date); // only update on confirm
                    hidePicker();
                  }}
                  onCancel={hidePicker}
                  minimumDate={new Date()} // prevents past selection
                  is24Hour={false}
                />
              </View>

            )

            }
            <Text style={styles.label}>Last Call Time</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={getActionOptions()}
                setSelected={setCallAction}
                disabled={!callstatus}
                placeholder="Select Last Call Time"
                save="value"
                search={false}
              // defaultOption={{ key: '0', value: lastCall }}  // if using default
              />
            </View>



            <Text style={styles.label}>Lead Status</Text>
            <View style={styles.pickerWrapper}>
              <SelectList
                data={leadstatus}
                setSelected={setLeadKey}
                placeholder={lead}
                save="key"
                search={false}
                defaultValue={lead}
              />
            </View>
            <TouchableOpacity onPress={handleSaveNote} style={[styles.dateButton, styles.saveButton]}>
              <Text style={[styles.dateText, { color: 'white', textAlign: 'center' }]}>Save</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView >
  );
};

export default UpdateScreen;

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
    marginRight: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 11,
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
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40
  },
  buttonText: {
    color: "white",
    // fontWeight: "bold",
    fontSize: 12,
  },
  switchButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
    textAlignVertical: "top",
  },

  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    // marginBottom: 10,
    marginTop: 15,
    marginLeft: 10
  },
  dateButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    elevation: 3,

  },
  dateText: {
    fontSize: 12,

  },
  scrollBox: {

    padding: 10,
    marginBottom: 15,
    borderRadius: 10,

  },
  scrollText: {
    color: "#fff",
    fontSize: 14,
  },
  social: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    gap: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 10,

    marginTop: 20,
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: 'top',
    padding: 10,
    backgroundColor: '#fff',
  },
  dateButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  dateText: {
    fontSize: 10,
    color: "#000",

  },
  placeholder: {
    color: "#999",
  },
  pickerWrapper: {
    marginTop: 10,
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: '#003961',
  },
  remarkText: {
    color: "white"
  },
  textlavel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 0,
    color: "#333",
    marginTop: 12,
  },
  disabledText: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    color: "#555",
  },

  remarkBox: {

    backgroundColor: '#f0f4f7',
    padding: 5,
    borderRadius: 5,
    // marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    // justifyContent: "space-evenly"

  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  scrollBox: {
    padding: 10,
    backgroundColor: '#c1c1c1',
    marginBottom: 10
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#888',
  },
  remarkBox: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10, // gap between boxes
    borderColor: '#ccc',
    borderWidth: 1,
  },
  notetext: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  followup: {
    display: "flex",
    flexDirection: "row",
    gap: 10
  },
  schedule:{
    marginTop:10,
    display:"flex",
    flexDirection:"row",
    gap:20
  },
  statusadd:{
     gap:15,
     display:"flex",
    flexDirection:"row"
  }
});


