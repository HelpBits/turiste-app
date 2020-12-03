import React, {useEffect, useState} from 'react';
import {Alert, Platform, StyleSheet} from 'react-native';
import {MAPBOX_ACCESSTOKEN} from '@env';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import MapComponent from '../components/MapComponent';

const points = firestore().collection(FirebaseCollectionEnum.MFChallengePoint);

const MapScreen = () => {
  const zoom = 6.3;
  const center = [-84.0795, 9.9328];

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
    });
  }, []);

  return (
    <>
      {mapPoints && (
        <MapComponent mapPoints={mapPoints} zoom={zoom} center={center} />
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
