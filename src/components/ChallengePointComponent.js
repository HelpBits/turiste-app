import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FeedScreen from '../screens/FeedScreen';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import { MFCheckin } from '../firebase/collections/MFCheckin';
import { Platform } from 'react-native';

const pointsRef = firestore().collection(
  FirebaseCollectionEnum.MFChallengePoint,
);

const usersRef = firestore().collection(FirebaseCollectionEnum.MFUser);
const challengesRef = firestore().collection(
  FirebaseCollectionEnum.MFChallenge,
);

const ChallengePointComponent = ({ selectedPoint, hasHeader = false }) => {
  const [userModel, setUserModel] = useState(null);
  const [arrivesNumber, setArrivesNumber] = useState(0);
  const [modalSize, setModalSize] = useState(75);
  const [modalTopOffset, setModalTopOffset] = useState(50);

  const modalizeRef = useRef(null);

  useEffect(() => {
    if (hasHeader === undefined) {
      return;
    }

    if (Platform.OS === 'ios') {
      setModalTopOffset(hasHeader ? 140 : 80);
      setModalSize(hasHeader ? 155 : 95);
    } else {
      setModalTopOffset(hasHeader ? 0 : 0);
    }
  }, [hasHeader]);

  useEffect(() => {
    const user = auth().currentUser;

    // get user data
    const unsubscribe = usersRef
      .where('mail', '==', user.email)
      .onSnapshot((snapshot) => {
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserModel(userData[0]);
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setArrivesNumber(0);
  }, [selectedPoint]);

  useEffect(() => {
    handleOpen();
    if (!userModel || !userModel.id || !selectedPoint.checkIns) {
      return;
    }

    const checkinNumber = selectedPoint.checkIns.filter(
      (checkin) => checkin.userId === userModel.id,
    ).length;

    setArrivesNumber(checkinNumber);
  }, [selectedPoint, userModel]);

  useEffect(() => {
    if (!selectedPoint || !userModel) {
      return;
    }

    if (!selectedPoint.challengeIds) {
      console.error('missing property challenge point', selectedPoint.id);
      return;
    }

    // create a dictionary
    const completedChallengesMap = {};
    userModel.completedChallengePointIds &&
      userModel.completedChallengePointIds.forEach(
        (value) => (completedChallengesMap[value] = true),
      );

    // get all challenges that are related with the current point
    selectedPoint.challengeIds.forEach(async (challengeId) => {
      // Ignore if is already completed
      if (completedChallengesMap[challengeId]) {
        return;
      }

      try {
        const challengeRef = await challengesRef.doc(challengeId).get();
        const challengeModel = challengeRef.data();

        // check for points id
        const completedChallenge = challengeModel.pointIds.every((value) =>
          userModel.visitedChallengePointIds.includes(value),
        );

        if (completedChallenge && !completedChallengesMap[challengeId]) {
          Alert.alert('Felicidades completó el reto de ', challengeModel.name);
          usersRef.doc(userModel.id).update({
            completedChallengePointIds: firestore.FieldValue.arrayUnion(
              challengeId,
            ),
          });
        }
      } catch (e) {
        console.error('Error validating challenges', e);
      }
    });
  }, [userModel, selectedPoint]);

  const handleOpen = () => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  };

  const markCheckin = async () => {
    if (!userModel) {
      return;
    }

    try {
      const point = await pointsRef.doc(selectedPoint.id).get();
      const currentCheckin = new MFCheckin(userModel.id, new Date());

      // update chekins
      selectedPoint.checkIns = point.data().checkIns
        ? point.data().checkIns
        : [];
      selectedPoint.checkIns.push(currentCheckin);

      const newCheckins = {
        checkIns: selectedPoint.checkIns,
      };

      await pointsRef.doc(selectedPoint.id).update(newCheckins);

      setArrivesNumber(arrivesNumber + 1);

      updateUserCheckins();
      Alert.alert('Check-in realizado correctamente');
    } catch (error) {
      console.error('No se puedo marcar el chek-in ', error);
      Alert.alert('No se puedo marcar el chek-in');
    }
  };

  const removeCheckin = async () => {
    Alert.alert(
      'Remover Check-In',
      '¿Seguro que no has visitado este lugar antes?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Si, seguro',
          onPress: async () => {
            if (!userModel) {
              return;
            }
            try {
              const newCheckins = {
                checkIns: [],
              };
              await pointsRef.doc(selectedPoint.id).update(newCheckins);
              setArrivesNumber(0);
              updateUserCheckins();
              Alert.alert('Se han removido los check-ins de este punto');
            } catch (error) {
              Alert.alert('No se puedo remover los chek-ins');
            }
          },
        },
      ],
    );
  };

  const updateUserCheckins = async () => {
    // update only if the id don't exist
    try {
      usersRef.doc(userModel.id).update({
        visitedChallengePointIds: firestore.FieldValue.arrayUnion(
          selectedPoint.id,
        ),
      });
    } catch (error) {
      console.error('Error updatings user checkins', error);
    }
  };

  const HeaderComponent = () => {
    return (
      <View style={styles.summaryHeader}>
        <View style={styles.headerContainer}>
          <Text style={styles.summaryHeaderTitle}>{selectedPoint.name}</Text>
          {arrivesNumber <= 0 ? (
            <Text>Aún no lo has visitado</Text>
          ) : (
            <Text>Has visitado este lugar {arrivesNumber} veces</Text>
          )}
          <Text style={styles.summaryHeaderDescription}>
            {selectedPoint.description}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {arrivesNumber > 0 && (
            <TouchableOpacity onPress={removeCheckin}>
              <Icon
                style={styles.summaryHeaderButton}
                name="close"
                size={30}
                color={colors.red}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={markCheckin}>
            {arrivesNumber <= 0 ? (
              <Icon
                style={styles.summaryHeaderButton}
                name="checkbox-blank-circle-outline"
                size={30}
                color={colors.gray}
              />
            ) : (
              <Icon
                style={styles.summaryHeaderButton}
                name="check-circle-outline"
                size={30}
                color={colors.green}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modalize
      modalTopOffset={modalTopOffset}
      ref={modalizeRef}
      alwaysOpen={modalSize}
      HeaderComponent={HeaderComponent}
      tapGestureEnabled={true}
      panGestureComponentEnabled={true}>
      <FeedScreen selectedChallengePoint={selectedPoint} />
    </Modalize>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '80%',
  },
  summaryHeader: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: 100,
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    paddingBottom: 0,
    backgroundColor: colors.white,
  },
  summaryHeaderTitle: {
    fontSize: 20,
  },
  summaryHeaderButton: {
    alignSelf: 'baseline',
  },
  summaryHeaderDescription: {
    marginTop: 10,
  },
});

export default ChallengePointComponent;
