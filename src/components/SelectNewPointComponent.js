import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { globalStyleSheet } from '../styles/theme';
import Geolocation from '@react-native-community/geolocation';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const SelectNewPointComponent = ({
  newPointCoordinates,
  setNewPointCoordinates,
  setShowSelectPointModal,
}) => {
  const [center, setCenter] = useState([-84.0795, 9.9328]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords);
        setCenter([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.log(error);
        Alert.alert('No podimos encontrar tu ubicacion');
      },
      {
        enableHighAccuracy: true,
        timeout: 2000000000,
        maximumAge: 1000,
      },
    );
    setNewPointCoordinates(null);
  }, []);

  const onPressMap = (e) => {
    const { geometry } = e;
    setNewPointCoordinates(geometry.coordinates);
  };

  const addNewPoint = () => {
    newPointCoordinates
      ? setShowSelectPointModal(false)
      : Alert.alert('Necesita elegir un punto');
  };

  const NewPointAnnotationContent = () => (
    <View style={styles.touchable}>
      <Icon name="map-marker" color="red" size={20} />
    </View>
  );

  return (
    <View style={styles.mainView}>
      <Text style={globalStyleSheet.title}>Agregar nuevo punto</Text>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView style={{ flex: 1 }} onPress={onPressMap}>
          <MapboxGL.Camera zoomLevel={12} centerCoordinate={center} />
          {newPointCoordinates && (
            <MapboxGL.PointAnnotation
              coordinate={newPointCoordinates}
              id="newPoint">
              <NewPointAnnotationContent coordinate={newPointCoordinates} />
            </MapboxGL.PointAnnotation>
          )}
          <MapboxGL.UserLocation />
        </MapboxGL.MapView>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => setShowSelectPointModal(false)}
          style={styles.hideModal}>
          <Text>OCULTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addNewPoint} style={styles.hideModal}>
          <Text>AGREGAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'green',
    borderRadius: 20,
    margin: 10,
    padding: 15,
    height: '50%',
    marginTop: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: '75%',
    width: '100%',
  },
  touchable: {
    width: 60,
    height: 30,
    alignItems: 'center',
  },
  hideModal: {
    marginVertical: 20,
    backgroundColor: 'lightgray',
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});

export default SelectNewPointComponent;
