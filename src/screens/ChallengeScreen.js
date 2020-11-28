import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChallengeComponent from '../components/ChallengeComponent';
import Modal from 'react-native-modal';

const ChallengeStatesEnum = {
  InProgress: 'En progreso',
  Completed: 'Completado',
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

const user = auth().currentUser;

const ChallengeScreen = ({navigation}) => {
  const [challengeState, setChallengeState] = useState(ChallengeStatesEnum.All);
  const [filteredChallenges, setFilteredChallenges] = useState(null);
  const [challenges, setChallenges] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(null);
  const [avalaibleChallenges, setAvalaibleChallenges] = useState(null);
  const [inProgressChallenges, setinProgressChallenges] = useState(null);

  const [pickerVisible, setPickerVisible] = useState(false);

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

  const fetchChallenges = () => {
    challengesRef.onSnapshot(async (snapshot) => {
      let newChallenges = snapshot.docs.map(
        (doc) => {
          return {id: doc.id, ...doc.data()};
        },
        (error) => {
          console.log('Error recuperando datos: ', error);
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

      let avalaibleChallenges = [];
      let completedChallenges = [];
      let inProgressChallenges = [];

      // filter challenges
      newChallenges.forEach(async (challenge) => {
        challenge.points = await Promise.all(challenge.points);

        let visitedPoints = 0;
        challenge.points.forEach((point) => {
          let userCheckinsNumber = 0;

          if (point.checkIns) {
            userCheckinsNumber = point.checkIns.filter(
              (checkin) => checkin.userId === user.uid,
            ).length;
          }

          visitedPoints += userCheckinsNumber > 0 ? 1 : 0;
        });

        if (visitedPoints === 0) {
          avalaibleChallenges.push(challenge);
        } else if (visitedPoints === challenge.points.length) {
          completedChallenges.push(challenge);
        } else {
          inProgressChallenges.push(challenge);
        }

        setChallenges(newChallenges);
      });

      setAvalaibleChallenges(avalaibleChallenges);
      setCompletedChallenges(completedChallenges);
      setinProgressChallenges(inProgressChallenges);
      setChallenges(newChallenges);
    });
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    handleChangeChallengeState(challengeState);
  }, [challenges]);

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: 'yellow', flexDirection: 'column'}}>
        <Modal
          isVisible={pickerVisible}
          backdropColor="#B4B3DB"
          backdropOpacity={0.3}
          animationIn="zoomInDown"
          animationOut="zoomOutUp">
          <View style={styles.pickerModal}>
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
            <TouchableOpacity
              style={styles.hideActionContainer}
              onPress={() => setPickerVisible(false)}>
              <Text>OCULTAR</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <TouchableOpacity onPress={() => setPickerVisible(true)}>
        <Text>{challengeState}</Text>
      </TouchableOpacity>
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
    height: '20%',
    width: '100%',
  },
  challenges: {
    marginTop: 10,
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
});

export default ChallengeScreen;
