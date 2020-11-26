import React from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const UserScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 30 }}>informacion del usuario u.u</Text>
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => Alert.alert('not now n.n')}>
      <Text>LOGOUT</Text>
    </TouchableOpacity>
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
