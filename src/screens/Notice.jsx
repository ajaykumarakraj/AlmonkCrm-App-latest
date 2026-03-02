import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker

const Notice = ({ navigation }) => {
  // State to handle text input values
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // State for the uploaded image

  // Function to handle photo upload from gallery
  const pickImage = () => {
    const options = {
      mediaType: 'photo', // Only pick photos
      quality: 1, // Set the quality of the image
      includeBase64: false, // Don't include base64 string
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setImage(response.assets[0].uri); // Save the image URI to state
      }
    });
  };

  // Function to handle Send button press
  const handleSend = () => {
    // You can add your logic here to send the data (e.g., subject, description, image URI)
    // console.log('Subject:', subject);
    // console.log('Description:', description);
    // console.log('Image URI:', image);
    alert('Notice sent successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notice Board</Text>
      </View> */}

      {/* Subject Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      {/* Description Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />
      </View>

      {/* Upload Photo Button */}
      <View style={styles.uploadContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload Photo from Gallery</Text>
        </TouchableOpacity>

        {/* Display selected image */}
        {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
      </View>

      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  uploadContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
  },
  selectedImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    marginTop: 10,
  },
  sendButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Notice;
