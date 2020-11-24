import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { MAPBOX_ACCESSTOKEN } from '@env';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DashboardComponent from '../components/DashboardComponent';
import AnnotationContent from '../components/AnnotationContentComponent';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const points = firestore().collection(FirebaseCollectionEnum.MFChallengePoint);

const MapScreen = () => {
  const zoom = 6.3;
  const center = [-84.0795, 9.9328];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const [mapPoints, setMapPoints] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      MapboxGL.requestAndroidLocationPermissions()
        .then((res) => console.log(res))
        .catch(() => Alert.alert('Error obteniendo permisos de ubicacion'));
    }

    points.onSnapshot(async (snapshot) => {
      setMapPoints(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }),
      );
    });
  }, []);

  // const [selectedPoint, setSelectedPoint] = useState({
  //   id: '001',
  //   name: 'Nombre del punto turistico',
  //   desc:
  //     'Lorem ipsum dolor sit amet' +
  //     'consectetur adipiscing elit.Nulla congue vehicula sodales.' +
  //     'Donec at suscipit urna, quis tempus sem.Fusce eget magna elit.',
  //   point: [-83.7028, 9.3755],
  // });

  // const testCoordinates = [
  //   {id: '001', name: 'PZ', point: [-83.7028, 9.3755]},
  //   {id: '002', name: 'SC', point: [-85.3509, 10.1929]},
  //   {id: '003', name: 'Maquenque', point: [-84.1319, 10.6552]},
  // ];89... new design

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
            ? mapPoints.map((coordinate) => (
              <MapboxGL.PointAnnotation
                coordinate={Object.values(coordinate.geometry)}
                id={coordinate.id}
                key={coordinate.id}>
                <AnnotationContent
                  coordinate={coordinate}
                  setSelectedPoint={setSelectedPoint}
                />
              </MapboxGL.PointAnnotation>
            ))
            : null}
        </MapboxGL.MapView>
      </View>
      {selectedPoint && (
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            console.log('abriendo');
            setModalVisible(true);
          }}>
          <View>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summaryHeaderTitle}>
                  {selectedPoint.name}
                </Text>
                <Text>Has visitado este lugar 8 veces</Text>
              </View>
              <Icon
                style={styles.summaryHeaderButton}
                name="check-circle"
                size={35}
                color="green"
              />
            </View>
            <Text style={styles.modalText}>{selectedPoint.desc}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setSelectedPoint(null)}
            style={styles.closePointInfo}>
            <Icon name="arrow-down" size={35} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
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
    // backgroundColor: 'white',
    // borderRadius: 10,
    // padding: 10,
    // elevation: 3,
    // height: '30%',ew design
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
  summaryHeader: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryHeaderTitle: {
    fontSize: 20,
  },
  summaryHeaderButton: {
    marginRight: 5,
  },
});

export default MapScreen;
