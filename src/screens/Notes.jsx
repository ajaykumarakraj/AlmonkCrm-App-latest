// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
//   Alert,
//   TextInput,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { SelectList } from 'react-native-dropdown-select-list';
// import ApiClient from '../component/ApiClient';

// const Notes = ({ route, navigation }) => {
//   const [notes, setNotes] = useState('');
//   const [siteVisitDate, setSiteVisitDate] = useState(null);
//   const [houseVisitDate, setHouseVisitDate] = useState(null);
//   const [officeVisitDate, setOfficeVisitDate] = useState(null);
//   const [midwayVisitDate, setMidwayVisitDate] = useState(null);

//   const [showSitePicker, setShowSitePicker] = useState(false);
//   const [showHousePicker, setShowHousePicker] = useState(false);
//   const [showOfficePicker, setShowOfficePicker] = useState(false);
//   const [showMidwayPicker, setShowMidwayPicker] = useState(false);

//   const [call, setCall] = useState("");
//   const [lastCall, setLastCall] = useState("");
//   const [lead, setLead] = useState("");

//   const Callstatus = [
//     { key: "1", value: "Connect" },
//     { key: "2", value: "Not Connect" },
//   ];

//   const leadstatus = [
//     { key: "1", value: "New" },
//     { key: "2", value: "In Progress" },
//     { key: "3", value: "Archived" },
//     { key: "4", value: "Converted" },
//   ];

//   const lastcalldata = [
//     { key: "1", value: "Morning" },
//     { key: "2", value: "Afternoon" },
//     { key: "3", value: "Evening" },
//   ];

//   const handleDateChange = (setter, setShow) => (event, selectedDate) => {
//     setShow(false);
//     if (selectedDate) {
//       setter(selectedDate);
//     }
//   };

//   const renderDateText = (date) => date ? date.toLocaleDateString() : 'Select date';

//   const formatDate = (date) => {
//     if (!date) return null;
//     return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//   };

//   const handleSave = async () => {
//     Alert.alert('Saving...', 'Please wait.');
//     try {
//       const updatedUser = {
//         lead_id: 1,
//         notes: notes,
//         site_visit: formatDate(siteVisitDate),
//         house_visit: formatDate(houseVisitDate),
//         office_visit: formatDate(officeVisitDate),
//         mid_way_visit: formatDate(midwayVisitDate),
//         call_status: call,
//         last_call_action: lastCall,
//         lead_status: lead,
//         remark: "",
//       };

//       const res = await ApiClient.post(
//         "/save-lead-notes",
//         updatedUser,
//         {
//           headers: {
//             Authorization:
//               "Bearer 2|laravel_sanctum_5NMXdskxMn7bn6e05Z4MdvQ94GD1FZjw9OZrvyPQ0e57010d",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // console.log("Success:", res.data);
//       Alert.alert("Success", "Client updated successfully!");
//       navigation.goBack();
//     } catch (error) {
//       console.error("Error posting data:", error);
//       Alert.alert("Error", "Failed to update client. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.scrollBox}>
//         <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
//           <Text style={styles.scrollText}>
//             This is sample text to show how the scroll view behaves with long notes.
//           </Text>
//         </ScrollView>
//       </View>

//       <Text style={styles.label}>Enter Notes</Text>
//       <TextInput
//         style={styles.textArea}
//         placeholder="Enter your notes here..."
//         multiline={true}
//         numberOfLines={6}
//         value={notes}
//         onChangeText={setNotes}
//       />

//       {/* Date Pickers */}
//       <Text style={styles.label}>Schedule Site Visit</Text>
//       <TouchableOpacity onPress={() => setShowSitePicker(true)} style={styles.dateButton}>
//         <Text style={[styles.dateText, !siteVisitDate && styles.placeholder]}>{renderDateText(siteVisitDate)}</Text>
//       </TouchableOpacity>
//       {showSitePicker && (
//         <DateTimePicker
//           value={siteVisitDate || new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={handleDateChange(setSiteVisitDate, setShowSitePicker)}
//         />
//       )}

//       <Text style={styles.label}>House Visit Completed</Text>
//       <TouchableOpacity onPress={() => setShowHousePicker(true)} style={styles.dateButton}>
//         <Text style={[styles.dateText, !houseVisitDate && styles.placeholder]}>{renderDateText(houseVisitDate)}</Text>
//       </TouchableOpacity>
//       {showHousePicker && (
//         <DateTimePicker
//           value={houseVisitDate || new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={handleDateChange(setHouseVisitDate, setShowHousePicker)}
//         />
//       )}

//       <Text style={styles.label}>Office Visit Completed</Text>
//       <TouchableOpacity onPress={() => setShowOfficePicker(true)} style={styles.dateButton}>
//         <Text style={[styles.dateText, !officeVisitDate && styles.placeholder]}>{renderDateText(officeVisitDate)}</Text>
//       </TouchableOpacity>
//       {showOfficePicker && (
//         <DateTimePicker
//           value={officeVisitDate || new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={handleDateChange(setOfficeVisitDate, setShowOfficePicker)}
//         />
//       )}

//       <Text style={styles.label}>Mid Way Visit Completed</Text>
//       <TouchableOpacity onPress={() => setShowMidwayPicker(true)} style={styles.dateButton}>
//         <Text style={[styles.dateText, !midwayVisitDate && styles.placeholder]}>{renderDateText(midwayVisitDate)}</Text>
//       </TouchableOpacity>
//       {showMidwayPicker && (
//         <DateTimePicker
//           value={midwayVisitDate || new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={handleDateChange(setMidwayVisitDate, setShowMidwayPicker)}
//         />
//       )}

//       {/* Dropdowns */}
//       <Text style={styles.label}>Call Status</Text>
//       <View style={styles.pickerWrapper}>
//         <SelectList
//           data={Callstatus}
//           setSelected={setCall}
//           placeholder="Select Call Status"
//           save="value"
//           search={false}
//         />
//       </View>

//       <Text style={styles.label}>Lead Status</Text>
//       <View style={styles.pickerWrapper}>
//         <SelectList
//           data={leadstatus}
//           setSelected={setLead}
//           placeholder="Select Lead Status"
//           save="value"
//           search={false}
//         />
//       </View>

//       <Text style={styles.label}>Last Call Time</Text>
//       <View style={styles.pickerWrapper}>
//         <SelectList
//           data={lastcalldata}
//           setSelected={setLastCall}
//           placeholder="Select Last Call Time"
//           save="value"
//           search={false}
//         />
//       </View>

//       {/* Save Button */}
//       <TouchableOpacity onPress={handleSave} style={[styles.dateButton, styles.saveButton]}>
//         <Text style={[styles.dateText, { color: 'white', textAlign: 'center' }]}>Save</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f1f1f1",
//     padding: 10,
//   },
//   scrollBox: {
//     backgroundColor: '#003961',
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 10,
//   },
//   scrollText: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   textArea: {
//     height: 120,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     textAlignVertical: 'top',
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   dateButton: {
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 10,
//     elevation: 3,
//     marginBottom: 10,
//   },
//   dateText: {
//     fontSize: 16,
//     color: "#000",
//   },
//   placeholder: {
//     color: "#999",
//   },
//   pickerWrapper: {
//     marginTop: 10,
//   },
//   saveButton: {
//     marginTop: 30,
//     backgroundColor: '#007BFF',
//   },
// });

// export default Notes;
