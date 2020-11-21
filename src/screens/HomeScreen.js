import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';
import DashboardComponent from '../components/DashboardComponent';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const HomeScreen = ({ navigation }) => {
  const [initiliazing, setInitiliazing] = useState(true);
  const [user, setUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const center = [-84.0795, 9.9328];
  const [selectedPoint, setSelectedPoint] = useState({});

  const testCoordinates = [
    { id: '001', name: 'PZ', point: [-83.7028, 9.3755] },
    { id: '002', name: 'SC', point: [-85.3509, 10.1929] },
    { id: '003', name: 'Maquenque', point: [-84.1319, 10.6552] },
  ];

  const iconPressed = ({ coordinate }) => {
    setSelectedPoint(coordinate);
  };

  const AnnotationContent = ({ coordinate }) => (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => iconPressed({ coordinate })}>
      <Icon name="map-marker" color="red" />
      <Text style={styles.touchableText}>{coordinate.name}</Text>
    </TouchableOpacity>
  );

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initiliazing) setInitiliazing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initiliazing) return null;

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
      <View style={styles.mainView}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} showUserLocation={true}>
            <MapboxGL.Camera zoomLevel={6} centerCoordinate={center} />
            {testCoordinates.map((coordinate) => (
              <MapboxGL.PointAnnotation
                coordinate={coordinate.point}
                id={coordinate.id}
                key={coordinate.id}>
                <AnnotationContent coordinate={coordinate} />
              </MapboxGL.PointAnnotation>
            ))}
          </MapboxGL.MapView>
        </View>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('DetailsScreen')}
        />
        <Button
          title="Log Out"
          onPress={() => navigation.navigate('LoginScreen')}
        />
      </View>
      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.textStyle}>{selectedPoint.name}</Text>
      </TouchableHighlight>
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '70%',
    width: '90%',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1,
  },
  openButton: {
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    height: 175,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  touchable: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableText: {
    color: 'black',
  },
  touchableContainer: {
    borderColor: 'black',
    borderWidth: 1.0,
    width: 60,
    borderRadius: 50,
  },
});

export default HomeScreen;
