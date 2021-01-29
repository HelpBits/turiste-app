import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import ChallengePointComponent from '../components/ChallengePointComponent';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { showMessage } from '../utils/showMessage';
import { MessageTypeEnum } from '../constants/MessageTypeEnum';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZ2VvdmFubnkxOSIsImEiOiJja2V3OXI0ZTYwN3BmMnNrM3F2YzYyeHdsIn0.V5sZS_dLZez1_0iLog3NlA',
);

const MapComponent = ({ mapPoints, zoom, center, hasHeader }) => {
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      MapboxGL.requestAndroidLocationPermissions()
        .then((res) => console.log(res))
        .catch(() =>
          showMessage(
            'Error obteniendo permisos de ubicacion',
            MessageTypeEnum.Error,
          ),
        );
    }
  }, []);

  const [selectedPoint, setSelectedPoint] = useState(null);
  return (
    <>
      <View style={styles.mainView}>
        <MapboxGL.MapView style={styles.mapView}>
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
                onSelected={() => setSelectedPoint(mapPoint)}>
                <Icon name="map-marker-alt" size={25} color={'red'} />
              </MapboxGL.PointAnnotation>
            ))
            : null}
        </MapboxGL.MapView>
      </View>
      {selectedPoint && (
        <ChallengePointComponent
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
