import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

const AuthStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="SignUpScreen"
      component={SignUpScreen}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);

const AuthNavigator =  () => {
  return (
    <NavigationContainer>
      <AuthStackScreen />
    </NavigationContainer>
  );
};

export default AuthNavigator;
