import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert, Modal, Platform} from 'react-native';
import {MAPBOX_ACCESSTOKEN} from '@env';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import DashboardComponent from '../components/DashboardComponent';
import AnnotationContent from '../components/AnnotationContentComponent';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import ChallengePointComponent from '../components/ChallengePointComponent';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZ2VvdmFubnkxOSIsImEiOiJja2V3OXI0ZTYwN3BmMnNrM3F2YzYyeHdsIn0.V5sZS_dLZez1_0iLog3NlA',
);

const points = firestore().collection(FirebaseCollectionEnum.MFChallengePoint);

const MapScreen = () => {
  const zoom = 6.3;
  const center = [-84.0795, 9.9328];

  const [modalVisible, setModalVisible] = useState(false);

  const [mapPoints, setMapPoints] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      MapboxGL.requestAndroidLocationPermissions()
        .then((res) => console.log(res))
        .catch(() => Alert.alert('Error obteniendo permisos de ubicacion'));
    }

    points.onSnapshot(async (snapshot) => {
      const newPoints = snapshot.docs.map((doc) => {
        return {id: doc.id, ...doc.data()};
      });
      setMapPoints(newPoints);

      console.log('POINTS ---> ', newPoints, snapshot.docs.length);
    });
  }, []);

  const [selectedPoint, setSelectedPoint] = useState(null);
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <DashboardComponent
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedPoint={selectedPoint}
          setSelectedPoint={setSelectedPoint}
        />
      </Modal>
      <View style={styles.mainView}>
        <MapboxGL.MapView style={styles.mapView}>
          <MapboxGL.Camera zoomLevel={zoom} centerCoordinate={center} />
          {mapPoints
            ? mapPoints.map((mapPoint) => (
                <MapboxGL.PointAnnotation
                  coordinate={[
                    mapPoint.geometry.latitude,
                    mapPoint.geometry.longitude,
                  ]}
                  id={mapPoint.id}
                  key={mapPoint.id}
                  onSelected={() => setSelectedPoint(mapPoint)}>
                  <AnnotationContent
                    coordinate={mapPoint.geometry}
                    setSelectedPoint={() => setSelectedPoint(mapPoint)}
                  />
                </MapboxGL.PointAnnotation>
              ))
            : null}
        </MapboxGL.MapView>
      </View>
      {selectedPoint && (
        <ChallengePointComponent selectedPoint={selectedPoint} />
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

export default MapScreen;
