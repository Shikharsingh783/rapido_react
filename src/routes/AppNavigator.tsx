import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import Destination from '../screens/Destination';
import CustomAutocomplete from '../utils/customAutoComplete';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Destination" component={Destination} />
      <Stack.Screen name="customAutocomplete" component={CustomAutocomplete} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
