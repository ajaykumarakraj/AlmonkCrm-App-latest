import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/Splash"; // Import the SplashScreen
import Login from "../screens/Login"; // Import the Login screen
import OTPScreen from "../screens/OTPScreen"; // Import the OTP screen
import SignupScreen from "../screens/SignUpScreen";


const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="OTPScreen" component={OTPScreen} />
<Stack.Screen name="SignUpScreen" component={SignupScreen} />
  </Stack.Navigator>
);

export default AuthStack;
