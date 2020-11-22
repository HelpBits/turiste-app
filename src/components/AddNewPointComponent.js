import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

const AddNewPointComponent = ({
  setNewPointModalVisible,
  newPointModalVisible,
}) => {
  return (
    <View style={styles.mainView}>
      <Text> Hi </Text>
      <TouchableOpacity
        onPress={() => setNewPointModalVisible(!newPointModalVisible)}
        style={styles.hideButton}>
        <Text>Ocultar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 10,
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgreen',
  },
  hideButton: {
    padding: 10,
    width: '30%',
    marginTop: 45,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
});

export default AddNewPointComponent;
