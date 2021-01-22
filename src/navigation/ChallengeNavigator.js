import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ChallengeScreen from '../screens/ChallengeScreen';

import ChallengeMapScreen from '../screens/ChallengeMapScreen';

export const ChallengeNavigator = createAppContainer(
  createStackNavigator({
    Retos: {
      screen: ChallengeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChallengeMap: {
      screen: ChallengeMapScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
      }),
    },
  }),
);
