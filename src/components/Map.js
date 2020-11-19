import React, {useState} from 'react';
import {View, StyleSheet, Button, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZ2VvdmFubnkxOSIsImEiOiJja2V3OXI0ZTYwN3BmMnNrM3F2YzYyeHdsIn0.V5sZS_dLZez1_0iLog3NlA',
);
// const { width, height } = Dimensions.get('window');

const OpenStreetMapScreen = ({ navigation }) => {
  const [coordinates] = useState([-83.7028, 9.3755]);
  // const [coordinates] = useState([-73.99155, 40.73581]);
  return (
    <View style={styles.mainView}>
      <Text style={{margin: 10}}>Mapa</Text>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={8} centerCoordinate={coordinates} />
          <MapboxGL.PointAnnotation coordinate={coordinates} id="Test" />
        </MapboxGL.MapView>
      </View>
      <Button
        title="Go to HomeScreen"
        onPress={() => navigation.navigate('HomeScreen')}
      />
    </View>
  );
};
export default OpenStreetMapScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'red',
    // margin: 10,
  },
  container: {
    // marginTop: 100,
    height: '80%',
    width: '90%',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1,
  },
});
