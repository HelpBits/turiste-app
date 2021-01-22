import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import UserScreen from '../screens/UserScreen';
import MapScreen from '../screens/MapScreen';
import AddScreen from '../screens/AddScreen';
import { ChallengeNavigator } from '../navigation/ChallengeNavigator';
import HelpScreen from '../screens/HelpScreen';

import Icon from 'react-native-vector-icons/FontAwesome5';

const TabNavigator = createBottomTabNavigator({
  Mapa: {
    screen: MapScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon name="map" size={20} color={focused ? '#111' : '#939393'} />
      ),
    },
  },
  Retos: {
    screen: ChallengeNavigator,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon name="flag" size={20} color={focused ? '#111' : '#939393'} />
      ),
    },
  },
  Agregar: {
    screen: AddScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon name="plus" size={20} color={focused ? '#111' : '#939393'} />
      ),
    },
  },
  Usuario: {
    screen: UserScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon name="user" size={20} color={focused ? '#111' : '#939393'} />
      ),
    },
  },
  Ayuda: {
    screen: HelpScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon name="home" size={20} color={focused ? '#111' : '#939393'} />
      ),
    },
  },
});

export default createAppContainer(TabNavigator);
