import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import FeedScreen from '../screens/FeedScreen'
import UserScreen from '../screens/UserScreen'
import MapScreen from '../screens/MapScreen'
import AddScreen from '../screens/AddScreen'
import ChallengeScreen from '../screens/ChallengeScreen'
import { Icon } from 'react-native-ui-kitten'


const TabNavigator = createBottomTabNavigator({
  Feed: {
    screen: FeedScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="home-outline"
          width={32}
          height={32}
          fill={focused ? '#111' : '#939393'}
        />
      )
    }
  },
  Map: {
    screen: MapScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="map-outline"
          width={32}
          height={32}
          fill={focused ? '#111' : '#939393'}
        />
      )
    }
  },
  Add: {
    screen: AddScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="plus-square-outline"
          width={32}
          height={32}
          fill={focused ? '#111' : '#939393'}
        />
      )
    }
  },
  Challenge: {
    screen: ChallengeScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="flag-outline"
          width={32}
          height={32}
          fill={focused ? '#111' : '#939393'}
        />
      )

    }
  },
  User: {
    screen: UserScreen,
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon
          name="person-outline"
          width={32}
          height={32}
          fill={focused ? '#111' : '#939393'}
        />
      )
    }
  },
})

export default createAppContainer(TabNavigator)
