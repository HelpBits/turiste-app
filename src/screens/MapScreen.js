import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
//import { MAPBOX_ACCESSTOKEN } from '@env';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DashboardComponent from '../components/DashboardComponent';
import AnnotationContent from '../components/AnnotationContentComponent';

MAPBOX_ACCESSTOKEN = 'pk.eyJ1IjoiZ2VvdmFubnkxOSIsImEiOiJja2V3OXI0ZTYwN3BmMnNrM3F2YzYyeHdsIn0.V5sZS_dLZez1_0iLog3NlA';
API_URL = 'API_URL';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const MapScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const center = [-84.0795, 9.9328];
  const [selectedPoint, setSelectedPoint] = useState(null);

  const testCoordinates = [
    { id: '001', name: 'PZ', point: [-83.7028, 9.3755] },
    { id: '002', name: 'SC', point: [-85.3509, 10.1929] },
    { id: '003', name: 'Maquenque', point: [-84.1319, 10.6552] },
  ];

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
        <View style={styles.mapContainer}>
          <MapboxGL.MapView style={styles.mapView}>
            <MapboxGL.Camera zoomLevel={6} centerCoordinate={center} />
            {testCoordinates.map((coordinate) => (
              <MapboxGL.PointAnnotation
                coordinate={coordinate.point}
                id={coordinate.id}
                key={coordinate.id}>
                <AnnotationContent
                  coordinate={coordinate}
                  setSelectedPoint={setSelectedPoint}
                />
              </MapboxGL.PointAnnotation>
            ))}
          </MapboxGL.MapView>
        </View>
      </View>
      {selectedPoint && (
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.textStyle}>{selectedPoint.name}</Text>
          <TouchableOpacity
            onPress={() => setSelectedPoint(null)}
            style={styles.closePointInfo}>
            <Icon name="arrow-down" size={15} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 75,
    height: '80%',
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  mapView: {
    flex: 1,
  },
  openButton: {
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    borderColor: 'black',
    borderWidth: 0.7,
  },
});

export default MapScreen;
