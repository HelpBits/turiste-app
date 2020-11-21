import React from 'react';
import { View, Button } from 'react-native';
import ExampleComponent from '../components/ExampleComponent';

const DetailsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <ExampleComponent />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DetailsScreen;
