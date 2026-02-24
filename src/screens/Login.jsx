import React, { useState } from "react";
import { Share } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import ApiClient from "../component/ApiClient";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  // Simple alert function
  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const sendOTP = async () => {
    const sanitizedNumber = phoneNumber.replace(/\D/g, "");
    if (!sanitizedNumber || sanitizedNumber.length !== 10) {
      showAlert("Invalid", "Please enter a valid 10 digit number");
      return;
    }

    try {
      const response = await ApiClient.post("/send-login-otp", {
        mobile: sanitizedNumber,
      });

      const data = response.data;

      if (data.status === 200) {
        showAlert("OTP Sent", `OTP sent to ${sanitizedNumber}`);
        navigation.navigate("OTPScreen", {
          phoneNumber: sanitizedNumber,
          generatedOTP: data.otp,
        });
      } else {
        showAlert("Error", data.message);
      }
    } catch (error) {
      console.error(error);
      showAlert(error, "Something went wrong");
    }
  };
const shareApp = async () => {
  try {
    await Share.share({
      message:
        "Download Almonk Digital CRM App now:\n\nhttps://play.google.com/store/apps/details?id=com.futurekey&hl=en_IN",
    });
  } catch (error) {
    Alert.alert("Error", "Unable to share app");
  }
};


const handleSignUp=()=>{
   navigation.navigate("SignUpScreen")
}
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* <ImageBackground
          source={require("../../Assets/images/login-bg.jpg")}
          style={styles.background}
          resizeMode="cover"
        > */}
          {/* <View style={styles.overlay}> */}
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.container}>
                {/* Logo */}
                <Image
                  source={require("../../Assets/images/FUTUREKEY-HOMES-3.1.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />

                {/* Card */}
                <View style={styles.card}>
                  <Text style={styles.title}>Almonk Login 🔐</Text>
                  <Text style={styles.subtitle}>
                    Enter your mobile number to continue
                  </Text>

                  {/* Input */}
                  <View style={styles.inputWrapper}>
                    <Icon name="call-outline" size={20} color="#003961" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Mobile Number"
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={(text) =>
                        setPhoneNumber(text.replace(/[^0-9]/g, ""))
                      }
                    />
                  </View>

                  {/* Button */}
                  <TouchableOpacity style={styles.button} onPress={sendOTP}>
                    <Icon name="paper-plane-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
              <View style={styles.box}>
                <TouchableOpacity style={styles.shareButton} onPress={handleSignUp}>
  <Icon name="person-add-outline" size={20} color="#003961" />
  <Text style={styles.shareText}>Sign Up</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.shareButton} onPress={shareApp}>
  <Icon name="share-social-outline" size={18} color="#003961" />
  <Text style={styles.shareText}>Share App</Text>
</TouchableOpacity>
              </View>
                </View>

                {/* Brand */}
                <View style={styles.brandContainer}>
                  <Text style={styles.brandMain}>Almonk Digital CRM</Text>
                  {/* <Text style={styles.brandSub}></Text> */}
                </View>
              </View>
            </ScrollView>
          {/* </View> */}
        {/* </ImageBackground> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flex: 1, width: "100%", height: "100%" },
  // overlay: {
  //   flex: 1,
  //   backgroundColor: "rgba(158, 19, 19, 0.3)",
  //   justifyContent: "center",
  // },
  scrollContainer: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 25 },
  container: { flex: 1, justifyContent: "center" },
  logo: { width: width * 0.6, height: 180, alignSelf: "center", marginBottom: 30 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#003961", textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fafafa",
    marginBottom: 20,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, marginLeft: 10, color: "#333" },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003961",
    paddingVertical: 15,
    borderRadius: 10,
  },
  shareButton: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 15,
  paddingHorizontal:30,
  paddingVertical: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#003961",
  backgroundColor: "#f4f8fb",
},

shareText: {
  color: "#003961",
  fontSize: 14,
  fontWeight: "600",
},
box:{
  display:"flex",
  flexDirection:"row",
 
  justifyContent:"space-evenly"
},
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  brandContainer: { alignItems: "center", marginBottom: 20, marginTop: 40 },
  brandMain: { fontSize: 20, fontWeight: "800", color: "#003961", letterSpacing: 1,textTransform:"uppercase" },
  brandSub: { fontSize: 34, fontWeight: "600", color: "#af5a1e", letterSpacing: 3 },
});