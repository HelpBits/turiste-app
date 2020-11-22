import 'react-native-gesture-handler';
import React, { Fragment } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import { mapping, light as lightTheme } from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten'
import { EvaIconsPack } from '@ui-kitten/eva-icons'


import TabNavigator from './src/navigation/TabNavigator'

const AuthStack = createStackNavigator();

const AuthStackScreen = () => {
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
    <AuthStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="DetailsScreen"
      component={DetailsScreen}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
};

export default () => (
  <NavigationContainer>
    <AuthStackScreen />
  </NavigationContainer>
);

