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

const pointsRef = firestore().collection(
  FirebaseCollectionEnum.MFChallengePoint,
);

const usersRef = firestore().collection(FirebaseCollectionEnum.MFUser);
const challengesRef = firestore().collection(
  FirebaseCollectionEnum.MFChallenge,
);

const ChallengePointComponent = ({ selectedPoint }) => {
  const [userModel, setUserModel] = useState(null);
  const [arrivesNumber, setArrivesNumber] = useState(0);

  const modalizeRef = useRef(null);

  useEffect(() => {
    console.log('RUNNING 1');
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
    console.log('RUNNING 2');
    handleOpen();
    setCheckinsNumber();
  }, [selectedPoint]);

  useEffect(() => {
    console.log('RUNNING 4');
    console.log('USER MODEL', userModel);

    if (!selectedPoint || !selectedPoint.challengeIds || !userModel) {
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
      // If is already completed, ignore
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
        console.log('Error validando retos', e);
      }
    });
  }, [userModel]);

  const handleClosed = () => {
    console.log('closed');
  };

  const handleOpen = () => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  };

  const setCheckinsNumber = () => {
    if (!userModel || !userModel.id || !selectedPoint.checkIns) {
      return;
    }

    const checkinNumber = selectedPoint.checkIns.filter(
      (checkin) => checkin.userId === userModel.id,
    ).length;

    setArrivesNumber(checkinNumber);
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

      setCheckinsNumber();
      updateUserCheckins();
      Alert.alert('Check-in realizado correctamente');
    } catch (error) {
      console.log('No se puedo marcar el chek-in ', error);
      Alert.alert('No se puedo marcar el chek-in');
    }
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
        <TouchableOpacity onPress={markCheckin}>
          {arrivesNumber <= 0 ? (
            <Icon
              style={styles.summaryHeaderButton}
              name="checkbox-blank-circle-outline"
              size={40}
              color={colors.red}
            />
          ) : (
              <Icon
                style={styles.summaryHeaderButton}
                name="check-circle-outline"
                size={40}
                color={colors.green}
              />
            )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modalize
      ref={modalizeRef}
      onClosed={handleClosed}
      alwaysOpen={170}
      modalStyle={{ marginTop: '10%' }}
      onOpen={() => console.log('OPEN')}
      onOpened={() => console.log('OPENED')}
      onPositionChange={(value) => console.log('position change', value)}
      scrollViewProps={{
        showsVerticalScrollIndicator: true,
        stickyHeaderIndices: [0],
      }}>
      <HeaderComponent />
      <FeedScreen selectedChallengePoint={selectedPoint} />
    </Modalize>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    maxWidth: '90%',
  },
  summaryHeader: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 30,
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
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
