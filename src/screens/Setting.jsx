import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Settings } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Setting = () => {
  const [officeVisitDate, setOfficeVisitDate] = useState(null);
  const [showOfficePicker, setShowOfficePicker] = useState(false);

  const renderDateText = (date) => {
    return date ? date.toLocaleDateString('en-GB') : 'Select Date';
  };

  const handleDateChange = (setDate, setShow) => (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      // 👉 Action after selecting date
      // console.log("Selected office visit date:", selectedDate.toLocaleDateString('en-GB'));
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.label}>Settings</Text>

      {/* <TouchableOpacity onPress={() => setShowOfficePicker(true)} style={styles.dateButton}>
        <Text style={[styles.dateText, !officeVisitDate && styles.placeholder]}>
          {renderDateText(officeVisitDate)}
        </Text>
      </TouchableOpacity>

      {showOfficePicker && (
        <DateTimePicker
          value={officeVisitDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange(setOfficeVisitDate, setShowOfficePicker)}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
  },
  placeholder: {
    color: '#aaa',
  },
});

export default Setting;
