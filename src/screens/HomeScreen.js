import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Alert,
    Modal,
} from 'react-native';import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESSTOKEN } from '@env';
import { TouchableHighlight } from 'react-native-gesture-handler';
import DashboardComponent from '../components/DashboardComponent';
import auth from '@react-native-firebase/auth';

MapboxGL.setAccessToken(MAPBOX_ACCESSTOKEN);

const HomeScreen = ({ route, navigation }) => {
  const { email } = route.params;
    const [initiliazing, setInitiliazing] = useState(true);
    const [user, setUser] = useState();

    const onAuthStateChanged = (user) => {
        setUser(user);
        if(initiliazing) setInitiliazing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    if (initiliazing) return null;

    if(!user) {
        return navigation.navigate('LoginScreen');
    }


    const [coordinates] = useState([-83.7028, 9.3755]);
    const [modalVisible, setModalVisible] = useState(false);
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
                <Text style={{ margin: 10 }}>Hi {email}</Text>
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
