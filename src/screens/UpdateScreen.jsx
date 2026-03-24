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
  Modal,
  Linking
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import SendIntentAndroid from "react-native-send-intent";
// import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { NativeModules } from "react-native";


const UpdateScreen = ({ route, navigation }) => {
  const { WhatsAppBusiness } = NativeModules;
   const [modalVisible, setModalVisible] = useState(false);
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
 
  const [showSitePicker, setShowSitePicker] = useState(false);
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
//visit status
const [VisitStatus,setVisitStatus]=useState("")
//show visit complete data 
const [poupdata,setPoupdata]=useState("")

// VisitCompleted  
const [visitCompleted,setVisitCompleted]=useState("")


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

const visitstatus=[
   {key: "schedule_site_visit",  value: "Schedule Site Visit" },
    {key: "office_visit",  value: "Office Visit" },
     {key: "house_visit",  value: "House Visit" },
]
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
    'Hang Up',
    'Wrong Number',
   


  ];

  const notConnectedOptions = [
    'Not Pick Up',
    'Not Reachable',
    'Number Busy',
    'Number Blocked',
    'Incoming Unavailable',
     'Switch Off',
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
   const handleVisitStatus = (selectedValue) => {
    setVisitStatus(selectedValue);
 
  };
  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);
  const handleConfirm = (date) => {

    // console.log("Selected DateTime:", moment(date).format('YYYY-MM-DD hh:mm A')); // ✅ log only
    setDateTime(date); // ✅ keep Date object in state
    hidePicker();
  };

//poup funtion
  const openPopup = async () => {
    setModalVisible(true);
  };

//poup funtion end


 
useEffect(()=>{
allapicall()
},[])

const allapicall=async()=>{
try {
  
 await Promise.all([
      fetchStates(),
      noteData(),
      getData(),
      fetchRequirements(),
      fetchTeamLeaders(),
    ]);

} catch (error) {
  console.log(error)
}
}

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
        setVisitStatus(fetchedUser.visit_status)
        
       if (fetchedUser.visit_status === "Schedule Site Visit") {
  if (fetchedUser.current_site_visit) {
    setSiteVisitDate(new Date(fetchedUser.current_site_visit));
  }
} 
else if (fetchedUser.visit_status === "Office Visit") {
  if (fetchedUser.current_office_visit) {
    setSiteVisitDate(new Date(fetchedUser.current_office_visit));
  }
} 
else if (fetchedUser.visit_status === "House Visit") {
  if (fetchedUser.current_house_visit) {
    setSiteVisitDate(new Date(fetchedUser.current_house_visit));
  }
}
          
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
        // console.log("get note", res.data)
        setVisitCompleted(res.data.schedule_log)
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
const renderDateText = (date) =>
  date
    ? date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Select Date";

  const formattedDate = dateTime ? moment(dateTime).format('YYYY-MM-DD HH:mm:ss') : "";
  const handleSaveNote = async () => {

    // console.log("date:", formattedDate)
    // console.log("Call status:", Callstatus)
    // console.log("last Call Action:", callAction)
    // console.log("leadkey:", leadkey)

    // Rule 1: Require follow-up date if not archived and no call status selected
    if (leadkey !== '4' && !formattedDate && !Callstatus == "0") {
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
        site_status:VisitStatus,
        site_visit: siteVisitDate,
        // house_visit: houseVisitDate,
        // office_visit: officeVisitDate,
        // mid_way_visit: midwayVisitDate,
        call_status: call,
        follow_up: formattedDate,
        last_call_action: callAction,
        lead_status: leadkey,
        remark: "",
        team_leader: teamLeaderId,
        agent: agentid,
       

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



const onselectteamleader = (id) => {
  setTeamLeaderId(id);
  setGetAgent("")
};

useEffect(() => {
  const fetchAgents = async () => {
    if (!teamLeaderId) return;

    try {
      const res = await axios.get(
        `https://api.almonkdigital.in/api/admin/get-agent/${teamLeaderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setAgentList(
          res.data.data.map((ag) => ({
            key: ag.id.toString(),
            value: ag.name,
          }))
        );
      }
    } catch (error) {
      console.log("Agent fetch error:", error);
    }
  };

  fetchAgents();
}, [teamLeaderId]);
  // console.log("lead user", user.user_id)
  // console.log("data note", data)


  // console.log("date", visitCompleted)


const handleWhatsapp = async () => {
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

      const message = "";

      // 🔥 Direct WhatsApp App Open
     const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      await Linking.openURL(url);
    }

  } catch (error) {
    console.log("WhatsApp Error:", error);
    Alert.alert("Error", "WhatsApp not installed or API failed");
  }
};
// bussiness whatsapp 

// const handleBussinessWhatsapp = () => {

//   SendIntentAndroid.openApp("com.whatsapp.w4b");

// };


const handleBussinessWhatsapp = async () => {
  try {
    const postkey = {
      id: userSearchdata,
      user_id: user.user_id,
      team_leader: teamLeaderId,
      agent: agentid,
      call_captured: "whatsapp"
    };
// console.log("postkey",postkey)
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

      const phone = "91" + number.replace(/[^0-9]/g, "");
      const message = "";

      // 🔥 Direct WhatsApp Business Open
      WhatsAppBusiness.open(phone, encodeURIComponent(message));
    }

  } catch (error) {
    console.log("WhatsApp Error:", error);
  }
};
// const handleBussinessWhatsapp = () => {
//   const phone = "91" + number.replace(/[^0-9]/g, "");
//   const message = "Hello";

//   WhatsAppBusiness.open(phone, encodeURIComponent(message));
// };

















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
// console.log(userSearchdata)
const completeside = () => {
  Alert.alert(
    "Confirm",
    "Are you sure to complete?",
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
            // console.log("ID:", userSearchdata,token);

            const res = await ApiClient.post(
              "/update-site-visit",
              {
                visit_status:VisitStatus,
        site_visit: siteVisitDate,
                id: userSearchdata,
                site_status: 1
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            // console.log("Success Response:", res.data);

            Alert.alert("Success", "Site visit completed");
            setStatus("complete");

          } catch (error) {
            console.log("Full Error:", error);
            // console.log("Response Error:", error?.response?.data);

            Alert.alert(
              "Error",
              error?.response?.data?.message ||
              error?.message ||
              "Something went wrong"
            );
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
    "Are you sure to remove?",
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
            // console.log("ID:", userSearchdata,token);

            const res = await ApiClient.post(
              "/update-site-visit",
              {
                visit_status:VisitStatus,
               site_visit: siteVisitDate,
                id: userSearchdata,
                site_status: 2
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            // console.log("Success Response:", res.data);

            Alert.alert("Success", "Site visit removed");
            setStatus("notcomplete");

          } catch (error) {
            console.log("Full Error:", error);
            // console.log("Response Error:", error?.response?.data);

            Alert.alert(
              "Error",
              error?.response?.data?.message ||
              error?.message ||
              "Something went wrong"
            );
          } finally {
            setLoading(false);
          }
        }
      }
    ]
  );
};



// console.log(VisitStatus,"VisitStatus")
//end side compelete or not api 

// show date in visit site 

// useEffect(() => {
//   if (!VisitStatus) return;

//   let selectedDate = null;

//   if (VisitStatus === "Schedule Site Visit" && VisitDate && VisitDate !== "1970-01-01") {
//     selectedDate = new Date(VisitDate);
//   } else if (VisitStatus === "Office Visit" && OfficeDate && OfficeDate !== "1970-01-01") {
//     selectedDate = new Date(OfficeDate);
//   } else if (VisitStatus === "House Visit" && HouseDate && HouseDate !== "1970-01-01") {
//     selectedDate = new Date(HouseDate);
//   }

//   setSiteVisitDate(selectedDate);
// }, [VisitStatus, VisitDate, OfficeDate, HouseDate]);



  // console.log(siteVisitDate,"siteVisitDate")

  const sortedTeamLeaderList = [...teamleaderlist].sort((a, b) =>
  a.value.localeCompare(b.value)
);
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
                  data={sortedTeamLeaderList}
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
                  placeholder={agentget||"Select Agent"}
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

              <ScrollView style={{ maxHeight: 300, }} nestedScrollEnabled={true}>
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
                    source={require('../../Assets/icons/whatsappB.png')}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleWhatsapp}>
                  <Image
                    source={require('../../Assets/icons/whatsapp.png')}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
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
  <Text style={styles.label}>Visit Status</Text>

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
<TouchableOpacity 
  onPress={openPopup}
  style={{
    backgroundColor: '#003961',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:5
  }}
>
  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
    View
  </Text>
</TouchableOpacity>
  </View>
</View>
  
<View>
  <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.popup}>

            <Text style={styles.title}>Site Shedule List</Text>

       <ScrollView >
  {visitCompleted ? (
    <>
      {visitCompleted.map((v, i) => (
        <View key={i} style={styles.visitCard}>
          
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{v.date}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text
              style={[
                styles.status,
                v.status === "Completed"
                  ? styles.completed
                  : styles.pending,
              ]}
            >
              {v.status}
            </Text>
          </View>

        </View>
      ))}
    </>
  ) : (
    <Text>Loading...</Text>
  )}
</ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
</View>
            <View   style={styles.visit}>
<SelectList 
                data={visitstatus}
                setSelected={handleVisitStatus}
                placeholder={VisitStatus ||"Select Visit Status"}
                save="key"
                
                search={false}
                defaultValue={VisitStatus}
              />
</View>

{VisitStatus && (
  <View>
    <TouchableOpacity
      onPress={() => setShowSitePicker(true)}
      style={styles.dateButton}
    >
      <Text
        style={[
          styles.dateText,
          !siteVisitDate && styles.placeholder
        ]}
      >
        {renderDateText(siteVisitDate)}
      </Text>
    </TouchableOpacity>

    {showSitePicker && (
      <DateTimePicker
        value={siteVisitDate || new Date()}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
         minimumDate={new Date()} 
        onChange={handleDateChange(setSiteVisitDate, setShowSitePicker)}
      />
    )}
  </View>
)}
  

            {/* <Text style={styles.label}>House Visit Completed</Text>
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
            )} */}

            {/* <Text style={styles.label}>Office Visit Completed</Text>
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
            )} */}

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
                // defaultValue={call}
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
    height: 70,
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
    paddingTop:10,
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
    height: 70,
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
    // marginBottom: 4,
    marginTop:10,
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
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center",
    width:"75%"
  },
  visit:{
    marginBottom:10,
    // padding:10
  },
    overlay:{
    flex:1,

   
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"rgba(0,0,0,0.5)",
  
  },
  popup:{
    width:300,
    backgroundColor:"#fff",
    padding:20,
    borderRadius:10,
     maxHeight:500,
  },
  title:{
    fontSize:18,
    fontWeight:"bold",
    marginBottom:10
  },
  closeBtn:{
    marginTop:20,
    backgroundColor:"red",
    padding:10,
    borderRadius:6,
    alignItems:"center"
  },
visitCard: {
  backgroundColor: "#fff",
  padding: 12,
  marginVertical: 6,
  borderRadius: 8,
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 4
},

label: {
  fontWeight: "bold",
  color: "#444"
},

value: {
  color: "#333"
},

status: {
  fontWeight: "600"
},

completed: {
  color: "green"
},

pending: {
  color: "orange"
}
});


