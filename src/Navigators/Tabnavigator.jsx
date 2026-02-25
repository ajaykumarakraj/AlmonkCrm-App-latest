// src/Navigators/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen'; // Home screen
import SettingsScreen from '../screens/SettingsScreen'; // Settings screen
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddClientScreen from '../screens/AddClientScreen'; // AddClientScreen

import NotificationScreen from '../screens/NotificationScreen';
import SearchScreen from '../screens/SearchScreen';
import MainStack from './MainStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Define icons for each screen
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'AddClientScreen') {
            iconName = focused ? 'add-circle' : 'add-circle-outline'; // Corrected icon name for AddClientScreen
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline'; // Corrected icon name for AddClientScreen
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';

          }


          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#003961', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddClientScreen" component={AddClientScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      
    </Tab.Navigator>
  );
};

export default TabNavigator;
