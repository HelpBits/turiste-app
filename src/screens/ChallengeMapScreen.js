import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import firestore from '@react-native-firebase/firestore';

import MapComponent from '../components/MapComponent';

const pointsRef = firestore().collection(
  FirebaseCollectionEnum.MFChallengePoint,
);

const challengesRef = firestore().collection(
  FirebaseCollectionEnum.MFChallenge,
);

const ChallengeMapScreen = ({ navigation }) => {
  const zoom = 6.3;
  const center = [-84.0795, 9.9328];
  const { challengeId } = navigation.state.params;
  const [mapPoints, setMapPoints] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChallengesPoints = async () => {
    if (!challengeId) {
      return;
    }
    let challenge;
    try {
      const challengeRef = await challengesRef.doc(challengeId).get();
      challenge = challengeRef.data();
    } catch (e) {
      console.log('Error obteniendo información del reto', e);
      Alert.alert('Error obteniendo información del reto');
      return;
    }

    let pointsPromises = [];
    try {
      pointsPromises = challenge.pointIds
        ? challenge.pointIds.map(async (id) => {
            const pointRef = await pointsRef.doc(id).get();
            return { id: pointRef.id, ...pointRef.data() };
          })
        : null;
    } catch (e) {
      console.log('Error obteniendo puntos del reto', e);
      Alert.alert('Error obteniendo puntos del reto');
      return;
    }

    let points = null;
    if (pointsPromises) {
      points = await Promise.all(pointsPromises);
    }
    setIsLoading(false);
    setMapPoints(points);
  };

  useEffect(() => {
    fetchChallengesPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const NoPointsRender = () => (
    <View style={styles.noPointsContainer}>
      <Image
        style={styles.cardImage}
        source={{
          uri: 'https://www.freepik.com/vectors/snow',
        }}
      />
      {isLoading ? (
        <Text style={styles.noPoinsText}>Cargando puntos del reto</Text>
      ) : (
        <Text style={styles.noPoinsText}>No hay puntos para este reto</Text>
      )}
    </View>
  );

  return (
    <>
      {mapPoints ? (
        <MapComponent
          mapPoints={mapPoints}
          zoom={zoom}
          center={center}
          hasHeader={true}
        />
      ) : (
        <View style={styles.container}>{<NoPointsRender />}</View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  cardHeader: {
    flex: 1,
    width: '100%',
    paddingBottom: 5,
    height: 100,
  },
  title: {
    fontSize: 30,
  },
  ChallengePickerState: {
    height: 50,
    width: '100%',
    borderBottomColor: 'black',
    backgroundColor: 'orange',
    borderWidth: 10,
    paddingBottom: 5,
  },
  challenges: {
    marginTop: 10,
  },
  noPointsContainer: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  noPointsText: {
    fontSize: 35,
  },
  cardImage: {
    flex: 0.5,
    width: 300,
  },
});

export default ChallengeMapScreen;
