import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChallengeComponent from '../components/ChallengeComponent';
import Modal from 'react-native-modal';
import { colors } from '../styles/theme';

const ChallengeStatesEnum = {
  InProgress: 'En progreso',
  Completed: 'Completados',
  Available: 'No inicados',
  All: 'Todos',
};

const challengeStates = [
  ChallengeStatesEnum.All,
  ChallengeStatesEnum.InProgress,
  ChallengeStatesEnum.Completed,
  ChallengeStatesEnum.Available,
];

const challengesRef = firestore().collection(
  FirebaseCollectionEnum.MFChallenge,
);

const challengesPointRef = firestore().collection(
  FirebaseCollectionEnum.MFChallengePoint,
);

const usersRef = firestore().collection(FirebaseCollectionEnum.MFUser);

const existChallenge = (challengeId, arr) =>
  arr.filter((val) => (val.id = challengeId)).length > 0;

const ChallengeScreen = ({ navigation }) => {
  const [challengeState, setChallengeState] = useState(ChallengeStatesEnum.All);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [avalaibleChallenges] = useState([]);
  const [inProgressChallenges, setinProgressChallenges] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [userModel, setUserModel] = useState(false);

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
    if (!userModel) {
      return;
    }
    challengesRef.onSnapshot(async (snapshot) => {
      let newChallenges = snapshot.docs.map(
        (doc) => {
          return { id: doc.id, ...doc.data() };
        },
        (error) => {
          console.error('Error recuperando datos: ', error);
          Alert.alert('Error recuperando datos');
        },
      );

      // map ids to complete object
      newChallenges = newChallenges.map((challenge) => {
        return {
          ...challenge,
          points: challenge.pointIds
            ? challenge.pointIds.map(async (id) => {
                const refPoint = await challengesPointRef.doc(id).get();
                return refPoint.data();
              })
            : [],
        };
      });

      let avalaibleTempChallenges = [];
      let completedTempChallenges = [];
      let inProgressTempChallenges = [];

      // filter challenges
      await newChallenges.forEach(async (challenge) => {
        challenge.points = await Promise.all(challenge.points);

        let visitedPoints = 0;
        challenge.points.forEach((point) => {
          let userCheckinsNumber = 0;

          if (point.checkIns) {
            userCheckinsNumber = point.checkIns.filter(
              (checkin) => checkin.userId === userModel.id,
            ).length;
          }

          visitedPoints += userCheckinsNumber > 0 ? 1 : 0;
        });

        if (visitedPoints === 0) {
          if (!existChallenge(challenge.id, [...avalaibleTempChallenges])) {
            avalaibleTempChallenges.push(challenge);
          }
        } else if (visitedPoints === challenge.points.length) {
          if (!existChallenge(challenge.id, [...completedTempChallenges])) {
            completedTempChallenges.push(challenge);
            setCompletedChallenges([...completedTempChallenges]);
          }
        } else {
          if (!existChallenge(challenge.id, [...inProgressTempChallenges])) {
            inProgressTempChallenges.push(challenge);
            setinProgressChallenges([...inProgressTempChallenges]);
          }
        }
      });

      setChallenges([...newChallenges]);
    });
  }, [userModel]);

  useEffect(() => {
    setFilteredChallenges(challenges);
  }, [challenges]);

  const handleChangeChallengeState = (newState) => {
    setChallengeState(newState);
    if (newState === ChallengeStatesEnum.Available) {
      setFilteredChallenges(avalaibleChallenges);
    }
    if (newState === ChallengeStatesEnum.InProgress) {
      setFilteredChallenges(inProgressChallenges);
    }
    if (newState === ChallengeStatesEnum.Completed) {
      setFilteredChallenges(completedChallenges);
    }
    if (newState === ChallengeStatesEnum.All) {
      setFilteredChallenges(challenges);
    }
  };

  const PickerComponent = () => {
    return Platform.OS !== 'ios' ? (
      <Picker
        selectedValue={challengeState}
        style={styles.ChallengePickerState}
        onValueChange={(itemValue, itemIndex) => {
          handleChangeChallengeState(itemValue);
        }}>
        {challengeStates.map((state, index) => (
          <Picker.Item label={state} value={state} key={index} />
        ))}
      </Picker>
    ) : null;
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && (
        <Modal
          isVisible={pickerVisible}
          backdropColor="#B4B3DB"
          backdropOpacity={0.3}
          animationIn="zoomInDown"
          animationOut="zoomOutUp">
          <View style={styles.pickerModal}>
            <PickerIOS
              selectedValue={challengeState}
              style={styles.ChallengePickerState}
              onValueChange={(itemValue, itemIndex) => {
                handleChangeChallengeState(itemValue);
              }}>
              {challengeStates.map((state, index) => (
                <PickerIOS.Item label={state} value={state} key={index} />
              ))}
            </PickerIOS>
            <TouchableOpacity
              style={styles.hideActionContainer}
              onPress={() => setPickerVisible(false)}>
              <Text>OCULTAR</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={styles.openPicker}
          onPress={() => setPickerVisible(true)}>
          <Text>{challengeState}</Text>
        </TouchableOpacity>
      )}
      <PickerComponent />
      <ScrollView style={styles.challenges}>
        {filteredChallenges &&
          filteredChallenges.map((challenge, index) => (
            <ChallengeComponent
              navigation={navigation}
              challenge={challenge}
              key={index}
            />
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
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
    height: 40,
    width: '100%',
    borderBottomColor: colors.primary,
    borderBottomWidth: 5,
    backgroundColor: 'white',
  },
  challenges: {
    marginTop: 10,
    width: '100%',
  },
  hideActionContainer: {
    width: '80%',
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
    padding: 15,
    borderRadius: 10,
  },
  pickerModal: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  openPicker: {
    backgroundColor: 'lightgray',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: 50,
  },
  openPickerText: { color: 'red' },
});

export default ChallengeScreen;
