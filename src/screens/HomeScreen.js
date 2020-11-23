import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';
import DashboardComponent from '../components/DashboardComponent';
import NewPointComponent from '../components/NewPointComponent';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import AnnotationContent from '../components/AnnotationContentComponent';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const HomeScreen = ({ navigation }) => {
  const [initiliazing, setInitiliazing] = useState(true);
  const [user, setUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const center = [-84.0795, 9.9328];

  const [newPointModalVisible, setNewPointModalVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState({});

  const testCoordinates = [
    { id: '001', name: 'PZ', point: [-83.7028, 9.3755] },
    { id: '002', name: 'SC', point: [-85.3509, 10.1929] },
    { id: '003', name: 'Maquenque', point: [-84.1319, 10.6552] },
  ];

  const onAuthStateChanged = (actualUser) => {
    setUser(actualUser);
    if (initiliazing) {
      setInitiliazing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initiliazing) {
    return null;
  }

  if (!user) {
    return navigation.navigate('LoginScreen');
  }

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
        />
      </Modal>
      <Modal
        animationType="fade"
        visible={newPointModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <NewPointComponent
          setShowPointModalCreation={setNewPointModalVisible}
        />
      </Modal>
      <View style={styles.mainView}>
        <View style={styles.header}>
          <Text style={{ margin: 10 }}>Hi</Text>
          <Button
            title="LOGOUT"
            onPress={() => navigation.navigate('LoginScreen')}
          />
        </View>
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
          <TouchableOpacity
            style={styles.addPointButton}
            onPress={() => setNewPointModalVisible(true)}>
            <Icon name="plus" size={30} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.textStyle}>{selectedPoint.name}</Text>
      </TouchableOpacity>
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
    height: '95%',
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
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  touchable: {
    width: 40,
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
  },
  touchableContainer: {
    borderColor: 'black',
    borderWidth: 1.0,
    width: 60,
    borderRadius: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addPointButton: {
    margin: 10,
    marginBottom: 50,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'red',
    padding: 5,
    width: 40,
  },
  mapActions: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'gray',
  },
});

export default HomeScreen;
