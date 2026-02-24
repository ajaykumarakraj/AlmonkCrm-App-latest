import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import ApiClient from '../component/ApiClient';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OTPScreen = () => {
  const { login, user } = useAuth();
  const route = useRoute();
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [fcmToken, setFcmToken] = useState('');
  const inputs = useRef([]);
  const isMounted = useRef(true); // mounted ref

  useEffect(() => {
    isMounted.current = true;
    inputs.current[0]?.focus();

    return () => {
      isMounted.current = false; // cleanup
    };
  }, []);

  // Safe alert
  const safeAlert = (title, message) => {
    if (isMounted.current) {
      Alert.alert(title, message);
    }
  };

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = text;
      setOtp(updatedOtp);
      if (index < 3) inputs.current[index + 1].focus();
    } else if (text === '') {
      const updatedOtp = [...otp];
      updatedOtp[index] = '';
      setOtp(updatedOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOTP = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      safeAlert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    try {
      const response = await ApiClient.post('/verify-login-otp', {
        mobile: phoneNumber,
        otp: enteredOtp,
      });

      if (response.data.status === 200 && response.data.data) {
        await login(response.data.data, response.data.token);
        safeAlert('Success', 'Logged in successfully!');
        const token = await AsyncStorage.getItem('FCM_TOKEN');
        setFcmToken(token);
      } else {
        safeAlert('Invalid OTP', response.data.message || 'Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      safeAlert('Error', 'Failed to verify OTP. Try again.');
    }
  };

  const resendOTP = async () => {
    try {
      const response = await ApiClient.post('/resend-otp', { mobile: phoneNumber });
      if (response.data.status === 200) {
        safeAlert('Success', 'OTP resent successfully!');
      } else {
        safeAlert('Error', response.data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      safeAlert('Error', 'Something went wrong while resending OTP.');
    }
  };

  useEffect(() => {
    const sendTokenToBackend = async () => {
      try {
        if (!user || !user.user_id || !fcmToken) return;
        const response = await ApiClient.post("/update-fcm-token", {
          user_id: user.user_id,
          fcm_token: fcmToken,
        });

        // console.log(
        //   response.data.status === 200
        //     ? response.data.message
        //     : 'Token update failed: ' + response.data.message
        // );
      } catch (error) {
        console.log("Error sending FCM token:", error);
      }
    };

    sendTokenToBackend();
  }, [fcmToken, user]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* <ImageBackground
        source={require('../../Assets/images/login-bg.jpg')}
        style={styles.background}
        resizeMode="cover"
      > */}
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.container}>
                <Image
                  source={require('../../Assets/images/FUTUREKEY-HOMES-3.1.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />

                <View style={styles.card}>
                  <Text style={styles.title}>OTP Verification 🔐</Text>
                  <Text style={styles.subtitle}>
                    Enter the 4-digit code sent to {phoneNumber}
                  </Text>

                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        ref={(ref) => (inputs.current[index] = ref)}
                        autoFocus={index === 0}
                      />
                    ))}
                  </View>

                  <TouchableOpacity onPress={resendOTP}>
                    <Text style={styles.resend}>Resend OTP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.brandContainer}>
                  <Text style={styles.brandMain}>ALMONK DIGITAL CRM</Text>
                  {/* <Text style={styles.brandSub}>CRM</Text> */}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      {/* </ImageBackground> */}
    </TouchableWithoutFeedback>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.6,
    height: 180,
    alignSelf: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#003961',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: 55,
    height: 55,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  resend: {
    color: '#d11a2a',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#003961',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandMain: {
    fontSize: 20,
    fontWeight: '800',
    color: '#003961',
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 30,
    fontWeight: '600',
    color: '#FF6B00',
    letterSpacing: 3,
  },
});