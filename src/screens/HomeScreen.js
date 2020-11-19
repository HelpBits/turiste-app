import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [coordinates] = useState([-83.7028, 9.3755]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>Hello {email || "user"}</Text>
      <Button
        title="See Map"
        onPress={() => navigation.navigate('MapScreen')}
      />
      <Button
        title="Login Screen"
        onPress={() => navigation.navigate('LoginScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
