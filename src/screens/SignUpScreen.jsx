
import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ApiClient from "../component/ApiClient";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");

  const supportNumber = "9761407482"; 
  const handleSignup = async () => {
    if (!name || !mobile || !email || !company || !city) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert("Error", "Enter valid 10 digit mobile number");
      return;
    }

    try {
      const response = await ApiClient.post("/register", {
        name,
        mobile,
        email,
        company,
        city,
      });

      if (response.data.status === 200) {
        Alert.alert("Success", "Account Created Successfully");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${supportNumber}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${supportNumber}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register to continue</Text>

          {/* Full Name */}
          <View style={styles.inputWrapper}>
            <Icon name="person-outline" size={20} color="#003961" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Mobile */}
          <View style={styles.inputWrapper}>
            <Icon name="call-outline" size={20} color="#003961" />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={(text) =>
                setMobile(text.replace(/[^0-9]/g, ""))
              }
            />
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Icon name="mail-outline" size={20} color="#003961" />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Company */}
          <View style={styles.inputWrapper}>
            <Icon name="business-outline" size={20} color="#003961" />
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={company}
              onChangeText={setCompany}
            />
          </View>

          {/* City */}
          <View style={styles.inputWrapper}>
            <Icon name="location-outline" size={20} color="#003961" />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Icon name="person-add-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}> Sign Up</Text>
          </TouchableOpacity>

          {/* Support Buttons */}
          <View style={styles.supportContainer}>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Icon name="call" size={18} color="#fff" />
              <Text style={styles.supportText}> Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Icon name="logo-whatsapp" size={18} color="#fff" />
              <Text style={styles.supportText}> WhatsApp</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fa" },
  container: { padding: 25 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#003961",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003961",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  supportContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003961",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 8,
  },
  supportText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
  },
});