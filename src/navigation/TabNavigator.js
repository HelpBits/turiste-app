import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import FeedScreen from '../screens/FeedScreen';
import UserScreen from '../screens/UserScreen';
import MapScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';

const TabNavigator = createBottomTabNavigator({
  Feed: {
    screen: FeedScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="home"
          size={20}
          color={focused ? '#111' : '#939393'}
        />
      )
    }
  },
  Mapa: {
    screen: MapScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="map"
          size={20}
          color={focused ? '#111' : '#939393'}
        />
      )
    }
  },
  Agregar: {
    screen: AddScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="plus"
          size={20}
          color={focused ? '#111' : '#939393'}
        />
      )
    }
  },
  Retos: {
    screen: ChallengeScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="flag"
          size={20}
          color={focused ? '#111' : '#939393'}
        />
      )

    }
  },
  Usuario: {
    screen: UserScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="user"
          size={20}
          color={focused ? '#111' : '#939393'}
        />
      )
    }
  },
})

export default createAppContainer(TabNavigator);
