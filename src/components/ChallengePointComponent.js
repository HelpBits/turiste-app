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
      setModalTopOffset(0);
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

  const markCheckIn = async () => {
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
      Alert.alert('Visita registrada correctamente');
    } catch (error) {
      console.error('No se puedo marcar el chek-in ', error);
      Alert.alert('No se puedo marcar la visita');
    }
  };

  const removeCheckIn = () => {
    Alert.alert('Remover visita', '¿Seguro que desea remover última visita?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Si, seguro',
        onPress: () => {
          if (!userModel) {
            return;
          }

          if (!selectedPoint || !selectedPoint.checkIns) return;

          const items = [...selectedPoint.checkIns];
          const index = items.find((item) => item.userId === userModel.id);

          if (index < 0) return;
          items.splice(index, 1);

          const filteredCheckIns = [...items];
          selectedPoint.checkIns = [...filteredCheckIns];
          const newCheckins = {
            checkIns: [...filteredCheckIns],
          };
          pointsRef
            .doc(selectedPoint.id)
            .update(newCheckins)
            .then(async () => {
              setArrivesNumber(arrivesNumber - 1);
              await updateUserCheckins();

              selectedPoint.challengeIds &&
                (await usersRef.doc(userModel.id).update({
                  completedChallengePointIds: firestore.FieldValue.arrayRemove(
                    ...selectedPoint.challengeIds,
                  ),
                  visitedChallengePointIds: firestore.FieldValue.arrayRemove(
                    selectedPoint.id,
                  ),
                }));
              Alert.alert('Se ha removido la última visita de este punto');
            })
            .catch((error) => {
              console.log('error updating check-ins, ', error);
              Alert.alert('No se puedo remover la visita');
            });
        },
      },
    ]);
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
          {arrivesNumber < 1 ? (
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
            <TouchableOpacity onPress={removeCheckIn}>
              <Icon
                style={styles.summaryHeaderButton}
                name="close"
                size={30}
                color={colors.red}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={markCheckIn}>
            {arrivesNumber < 1 && (
              <Icon
                style={styles.summaryHeaderButton}
                name="check-circle"
                size={30}
                color={colors.gray}
              />
            )}
            {arrivesNumber > 0 && (
              <Icon
                style={styles.summaryHeaderButton}
                name="check-circle"
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
