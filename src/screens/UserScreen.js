import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import {globalStyleSheet} from '../styles/theme';

import moment from 'moment';

import auth from '@react-native-firebase/auth';

const UserScreen = () => {
  const user = auth().currentUser._user;
  const logOut = () => auth().signOut();
  const [userInfo, setUserInfo] = useState({});
  const users = firestore().collection(FirebaseCollectionEnum.MFUser);

  useEffect(() => {
    try {
      users.where('mail', '==', user.email).onSnapshot(
        async (snapshot) => {
          const userData = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setUserInfo(userData[0]);
        },
        (error) => console.log(error),
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <View style={styles.mainView}>
      <Text style={globalStyleSheet.title}>Datos de Usuario</Text>
      <View>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldTextKey}>Usuario: </Text>
          {userInfo.username}
        </Text>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldTextKey}>Correo: </Text>
          {userInfo.mail}
        </Text>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldTextKey}>Fecha de Nacimiento: </Text>
          {moment(userInfo.birthdate).format('DD / MM / YYYY')}
        </Text>
        <View style={{marginVertical: 15}} />
        <Text style={styles.fieldTextAlt}>
          <Text style={styles.fieldTextKeyAlt}>Puntos Visitados: </Text>
          {userInfo.visitedChallengePointIds
            ? userInfo.visitedChallengePointIds.length
            : 0}
        </Text>
        <Text style={styles.fieldTextAlt}>
          <Text style={styles.fieldTextKeyAlt}>Desafíos Completados: </Text>
          {userInfo.completedChallengePointIds
            ? userInfo.completedChallengePointIds.length
            : 0}
        </Text>
      </View>
      <TouchableOpacity onPress={logOut} style={styles.logOutButton}>
        <Text>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  fieldText: {fontSize: 15, fontWeight: 'bold', margin: 10},
  fieldTextAlt: {fontSize: 17, fontWeight: 'bold', margin: 10},
  fieldTextKey: {color: 'gray'},
  fieldTextKeyAlt: {color: 'orange'},
  logOutButton: {
    backgroundColor: 'lightgray',
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 10,
    marginVertical: 30,
    borderRadius: 10,
    borderWidth: 0.3,
  },
});

export default UserScreen;
