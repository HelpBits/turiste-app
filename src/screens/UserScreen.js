import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import { globalStyleSheet } from '../styles/theme';
import { colors } from '../styles/theme';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View style={styles.mainView}>
        <View>
          <Text style={globalStyleSheet.title}>Datos de Usuario</Text>
          <View style={styles.userIconContainer}>
            <Image
              style={styles.logo}
              source={require('../../assets/tourism-icon.png')}
            />
          </View>
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
        </View>

        <TouchableOpacity onPress={logOut} style={styles.button}>
          <Text>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  fieldText: { fontSize: 15, width: '100%' },
  fieldTextAlt: { fontSize: 17, margin: 10 },
  fieldTextKey: { color: 'black' },
  fieldTextKeyAlt: { color: 'orange' },
  userIconContainer: {
    height: '45%',
    color: 'gray',
  },
  button: {
    backgroundColor: colors.primary,
    marginTop: 20,
    height: 48,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
    height: 120,
    width: 200,
    alignSelf: 'center',
  },
});

export default UserScreen;
