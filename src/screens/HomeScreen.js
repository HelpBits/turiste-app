import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const HomeScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [coordinates] = useState([-83.7028, 9.3755]);

  return (
    <View style={styles.mainView}>
      <Text style={{ marginTop: 20 }}>Mapa</Text>
      <Text style={{ margin: 10 }}>Hi {email}</Text>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={8} centerCoordinate={coordinates} />
          <MapboxGL.PointAnnotation coordinate={coordinates} id="Test" />
        </MapboxGL.MapView>
      </View>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('DetailsScreen')}
      />
      <Button
        title="Log Out"
        onPress={() => navigation.navigate('LoginScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: '70%',
    width: '90%',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen;
