import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import ChallengeComponent from '../components/ChallengeComponent';

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

      let tempAvalaibleChallenges = [];
      let tempCompletedChallenges = [];
      let tempInProgressChallenges = [];

      // filter challenges
      newChallenges.forEach(async (challenge) => {
        challenge.points = await Promise.all(challenge.points);

        let visitedPoints = 0;
        challenge.points.forEach((point) => {
          let userCheckinsNumber = 0;

          if (point.checkins) {
            userCheckinsNumber = point.checkins.filter(
              (checkin) => checkin.userId === user.uid,
            ).length;
          }

          visitedPoints += userCheckinsNumber > 0 ? 1 : 0;
        });

        if (visitedPoints === 0) {
          tempAvalaibleChallenges.push(challenge);
        } else if (visitedPoints === challenge.points.length) {
          tempCompletedChallenges.push(challenge);
        } else {
          tempInProgressChallenges.push(challenge);
        }

        setChallenges(newChallenges);
      });

      setAvalaibleChallenges(tempAvalaibleChallenges);
      setCompletedChallenges(tempCompletedChallenges);
      setinProgressChallenges(tempInProgressChallenges);
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
    height: 50,
    width: '100%',
    borderBottomColor: 'black',
    borderWidth: 10,
    paddingBottom: 5,
  },
  challenges: {
    marginTop: 10,
  },
});

export default ChallengeScreen;
