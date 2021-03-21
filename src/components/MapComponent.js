import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import ChallengePointComponent from '../components/ChallengePointComponent';
import Icon from 'react-native-vector-icons/FontAwesome5';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZ2VvdmFubnkxOSIsImEiOiJja2V3OXI0ZTYwN3BmMnNrM3F2YzYyeHdsIn0.V5sZS_dLZez1_0iLog3NlA',
);

const DEFAULT_ZOOM = 6.3;
const MapComponent = ({ mapPoints, hasHeader }) => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, changeCenter] = useState([-84.0795, 9.9328]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      MapboxGL.requestAndroidLocationPermissions()
        .then((res) => console.log(res))
        .catch(() => Alert.alert('Error obteniendo permisos de ubicacion'));
    }
  }, []);

  const zoomAndSelectPoint = (mapPoint) => {
    changeCenter([mapPoint.geometry.latitude, mapPoint.geometry.longitude]);
    setZoom(8);
    setSelectedPoint(mapPoint);
  };

  const onSelectedPointClose = () => {
    setZoom(DEFAULT_ZOOM);
    setSelectedPoint(null);
  };
  return (
    <>
      <View style={styles.mainView}>
        <MapboxGL.MapView
          style={styles.mapView}
          onPress={() => setSelectedPoint(null)}>
          <MapboxGL.Camera zoomLevel={zoom} centerCoordinate={center} />
          <MapboxGL.UserLocation />
          {mapPoints
            ? mapPoints.map((mapPoint, index) => (
                <MapboxGL.PointAnnotation
                  coordinate={[
                    mapPoint.geometry.latitude,
                    mapPoint.geometry.longitude,
                  ]}
                  id={mapPoint.id}
                  key={mapPoint.id}
                  onSelected={() => zoomAndSelectPoint(mapPoint)}>
                  <Icon name="map-marker-alt" size={25} color={'red'} />
                </MapboxGL.PointAnnotation>
              ))
            : null}
        </MapboxGL.MapView>
      </View>
      {selectedPoint && (
        <ChallengePointComponent
          onClose={onSelectedPointClose}
          selectedPoint={selectedPoint}
          hasHeader={hasHeader}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  openButton: {
    padding: 10,
    elevation: 2,
    height: '20%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'lightgray',
    justifyContent: 'space-between',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closePointInfo: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: 'black',
  },
});

export default MapComponent;
