import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, Alert, Modal} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {MAPBOX_ACCESSTOKEN} from '@env';
import {TouchableHighlight} from 'react-native-gesture-handler';
import DashboardComponent from '../components/DashboardComponent';
import auth from '@react-native-firebase/auth';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZ2VvdmFubnkxOSIsImEiOiJja2V3OXI0ZTYwN3BmMnNrM3F2YzYyeHdsIn0.V5sZS_dLZez1_0iLog3NlA',
);

const HomeScreen = ({route, navigation}) => {
  const [initiliazing, setInitiliazing] = useState(true);
  const [user, setUser] = useState();
  const [coordinates] = useState([-83.7028, 9.3755]);
  const [modalVisible, setModalVisible] = useState(false);

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
        />
      </Modal>
      <View style={styles.mainView}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} showUserLocation={true}>
            <MapboxGL.Camera zoomLevel={6} centerCoordinate={coordinates} />
            <MapboxGL.PointAnnotation coordinate={coordinates} id="Test" />
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
        <Text style={styles.textStyle}>Show Modal</Text>
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
});

export default HomeScreen;
