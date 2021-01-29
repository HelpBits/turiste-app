import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import firestore from '@react-native-firebase/firestore';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import MapComponent from '../components/MapComponent';

import { showMessage } from '../utils/showMessage';
import { MessageTypeEnum } from '../constants/MessageTypeEnum';

const points = firestore().collection(FirebaseCollectionEnum.MFChallengePoint);

const MapScreen = () => {
  const zoom = 6.3;
  const center = [-84.0795, 9.9328];

  const [mapPoints, setMapPoints] = useState(null);

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

    points.onSnapshot(async (snapshot) => {
      const newPoints = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
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

export default MapScreen;
