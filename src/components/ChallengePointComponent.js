import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {Modalize} from 'react-native-modalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FeedScreen from '../screens/FeedScreen';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import {MFCheckin} from '../firebase/collections/MFCheckin';

const pointsRef = firestore().collection(
  FirebaseCollectionEnum.MFChallengePoint,
);

const usersRef = firestore().collection(FirebaseCollectionEnum.MFUser);
const user = auth().currentUser;

const ChallengePointComponent = ({selectedPoint}) => {
  const [arrivesNumber, setArrivesNumber] = useState(0);
  const modalizeRef = useRef(null);

  const handleClosed = () => {
    console.log('closed');
  };

  const handleOpen = () => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  };

  const setCheckinsNumber = () => {
    const checkinNumber = selectedPoint.checkins.filter(
      (chekin) => chekin.userId === user.uid,
    ).length;

    setArrivesNumber(checkinNumber);
  };

  const markCheckin = async () => {
    try {
      const point = await pointsRef.doc(selectedPoint.id).get();
      const currentCheckin = new MFCheckin(user.uid, new Date());
      // update chekins
      selectedPoint.checkins = point.data().checkins
        ? point.data().checkins
        : [];
      selectedPoint.checkins.push(currentCheckin);

      const newCheckins = {
        checkins: selectedPoint.checkins,
      };

      await pointsRef.doc(selectedPoint.id).update(newCheckins);

      setCheckinsNumber();
      Alert.alert('Check-in realizado correctamente');
      updateUserCheckins();
    } catch (error) {
      console.log('No se puedo marcar el chek-in ', error);
      Alert.alert('No se puedo marcar el chek-in');
    }
  };

  const updateUserCheckins = () => {
    usersRef
      .where('mail', '==', user.email)
      .get()
      .then((snapshot) => {
        const userModel = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('VALUE ', userModel);

        // update only if the id don't exist
        usersRef.doc(userModel[0].id).update({
          visitedChallengePointIds: firestore.FieldValue.arrayUnion(
            selectedPoint.id,
          ),
        });
      });
  };

  const HeaderComponent = () => {
    return (
      <View style={styles.summaryHeader}>
        <View>
          <Text style={styles.summaryHeaderTitle}>{selectedPoint.name}</Text>
          {arrivesNumber <= 0 ? (
            <Text>Aún no lo has visitado</Text>
          ) : (
            <Text>Has visitado este lugar {arrivesNumber} veces</Text>
          )}
        </View>
        <TouchableOpacity onPress={markCheckin}>
          {arrivesNumber <= 0 ? (
            <Icon
              style={styles.summaryHeaderButton}
              name="checkbox-blank-circle-outline"
              size={40}
              color="red"
            />
          ) : (
            <Icon
              style={styles.summaryHeaderButton}
              name="check-circle-outline"
              size={40}
              color="black"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    handleOpen();
    setCheckinsNumber();
  }, []);

  return (
    <Modalize
      ref={modalizeRef}
      onClosed={handleClosed}
      alwaysOpen={200}
      modalStyle={{marginTop: '10%'}}
      onOpen={() => console.log('OPEN')}
      onOpened={() => console.log('OPENED')}
      onPositionChange={(value) => console.log('position change', value)}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
      }}>
      <HeaderComponent />
      <FeedScreen selectedChallengePointId={selectedPoint.id} />
    </Modalize>
  );
};

const styles = StyleSheet.create({
  summaryHeader: {
    flexDirection: 'row',
    flex: 1,
    height: 200,
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    backgroundColor: 'green',
  },
  summaryHeaderTitle: {
    fontSize: 20,
  },
  summaryHeaderButton: {
    alignSelf: 'baseline',
  },
});

export default ChallengePointComponent;
