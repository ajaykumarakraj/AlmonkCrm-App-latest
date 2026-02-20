import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ImageBackground, 
  ActivityIndicator, 
  Dimensions 
} from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../../Assets/images/login-bg.jpg")} // stylish background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image 
          source={require('../../Assets/images/FUTUREKEY-HOMES-3.1.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>Almonk Digital</Text>
        <Text style={styles.subtitle}>CRM</Text>
        <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)', // semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.25,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 28,
    color: '#FF6B00',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  loader: {
    marginTop: 20,
  },
});