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
    }, 2000); // 3 seconds
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
  
      <View style={styles.overlay}>
        <Image 
          source={require('../../Assets/images/FUTUREKEY-HOMES-3.1.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>ALMONK DIGITAL</Text>
        <Text style={styles.subtitle}>CRM</Text>
        <ActivityIndicator size="large" color="#003961" style={styles.loader} />
      </View>
 
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
   // semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.25,
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    color: '#003961',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 27,
    color: '#003961',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  loader: {
    marginTop: 20,
  },
});