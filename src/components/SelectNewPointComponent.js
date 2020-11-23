import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome5';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const SelectNewPointComponent = ({
  newPoinCoordinates,
  setNewPoinCoordinates,
  setShowChoosePointModal,
}) => {
  const center = [-84.0795, 9.9328];

  useEffect(() => {
    setNewPoinCoordinates(null);
  }, []);

  const onPressMap = (e) => {
    const { geometry } = e;
    setNewPoinCoordinates(geometry.coordinates);
  };

  const NewPointAnnotationContent = () => (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => setShowChoosePointModal(false)}>
      <Icon name="map-marker" color="red" />
      <Text style={styles.touchableText}>Agregar</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainView}>
      <View style={styles.mapContainer}>
        <Text style={{ marginBottom: 15 }}>Agregar nuevo punto</Text>
        <MapboxGL.MapView style={{ flex: 1 }} onPress={onPressMap}>
          <MapboxGL.Camera zoomLevel={6} centerCoordinate={center} />
          {newPoinCoordinates && (
            <MapboxGL.PointAnnotation
              coordinate={newPoinCoordinates}
              id="newPoint">
              <NewPointAnnotationContent coordinate={newPoinCoordinates} />
            </MapboxGL.PointAnnotation>
          )}
          <MapboxGL.UserLocation visible={true} />
        </MapboxGL.MapView>
      </View>
      <TouchableOpacity onPress={() => setShowChoosePointModal(false)}>
        <Text>OCULTAR</Text>
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
  },
  hideButton: {
    padding: 10,
    width: '30%',
    marginTop: 45,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  mapContainer: {
    height: '80%',
    width: '100%',
  },
  touchable: {
    width: 60,
    height: 30,
    alignItems: 'center',
  },
  touchableText: {
    color: 'black',
    backgroundColor: 'lightblue',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 5,
    padding: 1,
    marginTop: 3,
  },
});

export default SelectNewPointComponent;
