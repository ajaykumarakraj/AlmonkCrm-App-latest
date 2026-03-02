import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Share from 'react-native-share'; // Import the Share module

const ShareScreen = ({ navigation }) => {

  // Function to trigger the share dialog for specific apps (WhatsApp, Instagram, Facebook)
  const onShareToApp = async (app) => {
    let shareOptions = {};

    switch (app) {
      case 'whatsapp':
        shareOptions = {
          title: 'Share via WhatsApp',
          message: 'Check out this awesome app!',
          social: Share.Social.WHATSAPP, // Specify WhatsApp
        };
        break;
      case 'facebook':
        shareOptions = {
          title: 'Share via Facebook',
          message: 'Check out this awesome app!',
          social: Share.Social.FACEBOOK, // Specify Facebook
        };
        break;
      case 'instagram':
        shareOptions = {
          title: 'Share via Instagram',
          message: 'Check out this awesome app!',
          social: Share.Social.INSTAGRAM, // Specify Instagram
        };
        break;
      default:
        return; // Do nothing if app is not specified
    }

    try {
      const result = await Share.open(shareOptions);
      // console.log(result); // Log result
    } catch (error) {
      console.log('Error sharing to ' + app + ': ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Share</Text>
      </View> */}

      {/* Share Buttons */}
      <TouchableOpacity onPress={() => onShareToApp('whatsapp')} style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share on WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onShareToApp('facebook')} style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share on Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onShareToApp('instagram')} style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share on Instagram</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShareScreen;
