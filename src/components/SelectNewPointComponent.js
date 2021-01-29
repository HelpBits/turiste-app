import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Geolocation from '@react-native-community/geolocation';

import { showMessage } from '../utils/showMessage';
import { MessageTypeEnum } from '../constants/MessageTypeEnum';

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
        console.error('Error getting user location', error);
        showMessage('No pudimos encontrar tu ubicacion', MessageTypeEnum.Error);
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
      : showMessage('Necesita elegir un punto', MessageTypeEnum.Error);
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
    flex: 1,
  },
  mapContainer: {
    marginTop: '10%',
    borderRadius: 30,
    height: '85%',
    width: '100%',
  },
  touchable: {
    width: 60,
    height: 30,
    alignItems: 'center',
  },
  hideModal: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'lightgray',
    padding: 10,
    width: '45%',
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 0.3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SelectNewPointComponent;
