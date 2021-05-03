import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Geolocation from '@react-native-community/geolocation';
import { colors } from '../styles/theme';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const SelectNewPointComponent = ({
  newPointCoordinates,
  setNewPointCoordinates,
  setShowSelectPointModal,
}) => {
  const [center, setCenter] = useState([-84.0795, 9.9328]);
  const [currentPoint, setCurrentPoint] = useState(null);

  useEffect(() => {
    setCurrentPoint(newPointCoordinates);

    if (newPointCoordinates) {
      setCenter([...newPointCoordinates]);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressMap = (e) => {
    const { geometry } = e;

    setCurrentPoint(null);

    setTimeout(() => {
      setCurrentPoint(geometry.coordinates);
    }, 10);

    //setNewPointCoordinates(geometry.coordinates);
  };

  const cleanSelectedPoint = () => {
    setCurrentPoint(null);
    setNewPointCoordinates(null);
    setShowSelectPointModal(false);
  };

  const addNewPoint = () => {
    setNewPointCoordinates(currentPoint);
    if (currentPoint) {
      setCurrentPoint(null);
    }

    currentPoint
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
      <View style={styles.mapContainer}>
        <MapboxGL.MapView style={{ flex: 1 }} onPress={onPressMap}>
          <MapboxGL.Camera zoomLevel={12} centerCoordinate={center} />
          {currentPoint && (
            <MapboxGL.PointAnnotation coordinate={currentPoint} id="newPoint">
              <NewPointAnnotationContent coordinate={currentPoint} />
            </MapboxGL.PointAnnotation>
          )}
          <MapboxGL.UserLocation />
        </MapboxGL.MapView>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={cleanSelectedPoint} style={styles.hideModal}>
          <Text>Ocultar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addNewPoint} style={styles.button}>
          <Text>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  mapContainer: {
    marginTop: '10%',
    borderRadius: 5,
    height: '85%',
    width: '100%',
  },
  touchable: {
    width: 60,
    height: 30,
    alignItems: 'center',
  },
  hideModal: {
    backgroundColor: colors.lightGray,
    marginTop: 20,
    height: 48,
    width: '45%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: colors.primary,
    marginTop: 20,
    height: 48,
    width: '45%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SelectNewPointComponent;
