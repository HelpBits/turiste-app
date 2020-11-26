import React from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import ChallengePointComponent from '../components/ChallengePointComponent';

const UserScreen = () => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <ChallengePointComponent />
  </View>
);

const styles = StyleSheet.create({
  touchable: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    margin: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default UserScreen;
