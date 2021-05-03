import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import { globalStyleSheet } from '../styles/theme';
import { colors } from '../styles/theme';
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';

const UserScreen = () => {
  const user = auth().currentUser._user;
  const logOut = () => auth().signOut();
  const [userInfo, setUserInfo] = useState({});
  const [birthdate, setBirthdate] = useState('');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userInfo || !userInfo.birthdate) return;

    setBirthdate(userInfo.birthdate);
  }, [userInfo]);

  return (
    <View
      style={{ ...styles.mainView, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
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
          {birthdate}
        </Text>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldTextKey}>Puntos Visitados: </Text>
          {userInfo.visitedChallengePointIds
            ? userInfo.visitedChallengePointIds.length
            : 0}
        </Text>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldTextKey}>Desafíos Completados: </Text>
          {userInfo.completedChallengePointIds
            ? userInfo.completedChallengePointIds.length
            : 0}
        </Text>
      </View>
      <TouchableOpacity onPress={logOut} style={styles.button}>
        <Text>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { flex: 1, padding: 10 },
  fieldText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
  fieldTextAlt: {
    fontSize: 17,
    fontWeight: 'bold',
    margin: 10,
  },
  fieldTextKey: { color: 'gray' },
  fieldTextKeyAlt: { color: 'orange' },
  button: {
    backgroundColor: colors.primary,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserScreen;
