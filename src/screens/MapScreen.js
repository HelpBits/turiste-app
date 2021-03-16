import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import MapComponent from '../components/MapComponent';

const points = firestore().collection(FirebaseCollectionEnum.MFChallengePoint);

const MapScreen = () => {
  const [mapPoints, setMapPoints] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      MapboxGL.requestAndroidLocationPermissions()
        .then((res) => console.log(res))
        .catch(() => Alert.alert('Error obteniendo permisos de ubicacion'));
    }

    points.onSnapshot(async (snapshot) => {
      const newPoints = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setMapPoints(newPoints);
    });
  }, []);

  return <>{mapPoints && <MapComponent mapPoints={mapPoints} />}</>;
};

export default MapScreen;
