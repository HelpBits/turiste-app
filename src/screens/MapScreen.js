import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import MapComponent from '../components/MapComponent';

const points = firestore().collection(FirebaseCollectionEnum.MFChallengePoint);

const MapScreen = () => {
  const [mapPoints, setMapPoints] = useState(null);

  useEffect(() => {
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
