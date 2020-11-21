import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ExampleComponent = () => {
  return (
    <View style={styles.mainView}>
      <Text style={{ margin: 10 }}>Example Component</Text>
    </View>
  );
};
export default ExampleComponent;

const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
