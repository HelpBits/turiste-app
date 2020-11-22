import React, { useState } from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../styles/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import { RolesEnum } from '../constants/RoleEnum';
import { FirebaseAuthErrorEnum } from '../constants/FirebaseAuthErrorEnum';
import { MessagesConstants } from '../constants/MessagesConstants';
import { MFUser } from '../firebase/collections/MFUser';
import DateTimePicker from '@react-native-community/datetimepicker';
import validations from '../utils/validation';

const users = firestore().collection(FirebaseCollectionEnum.MFUser);
const roles = firestore().collection(FirebaseCollectionEnum.MFRole);

// calculate the date five year ago
const currentDate = new Date();
const fiveYearsAgo = new Date(
  currentDate.getFullYear() - 5,
  currentDate.getMonth(),
  currentDate.getDay(),
);
const minDate = new Date(
  currentDate.getFullYear() - 100,
  currentDate.getMonth(),
  currentDate.getDay(),
);
const defaultDate = fiveYearsAgo;

export default function RegistrationScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [birthdate, setBirthdate] = useState(defaultDate);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const date = selectedDate || birthdate;
    setShow(Platform.OS === 'ios');
    setBirthdate(date);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onFooterLinkPress = () => {
    navigation.navigate('LoginScreen');
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const getDate = () => {
    if (birthdate === defaultDate) {
      return 'Fecha de nacimiento';
    }
    return birthdate.toLocaleDateString();
  };

  const onRegisterPress = async () => {
    if (!username) {
      Alert.alert('Usuario es requerido');
      return;
    }

    if (!birthdate === defaultDate) {
      Alert.alert('Fecha de nacimiento es requerida');
      return;
    }

    if (!email) {
      Alert.alert('Correo es requerido.');
      return;
    }

    if (!validations.validateEmail(email)) {
      Alert.alert('Formato de correo incorrecto');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Contraseñas no coinciden.');
      return;
    }

    try {
      const register = await auth()
        .createUserWithEmailAndPassword(email, password)
        .catch((err) => {
          Alert.alert('Ha ocurrido un error!');
          console.log(err);
        });
      if (register.user) {
        roles.onSnapshot(async (snapshot) => {
          const rolesCollection = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));

          const userRole = rolesCollection.filter(
            (role) => role.name == RolesEnum.User,
          );

          const newUser = new MFUser(
            email,
            username,
            birthdate,
            false,
            userRole[0],
            [],
            [],
          );

          await users.add(newUser);
          navigation.navigate('LoginScreen');
        });
      }
    } catch (e) {
      if (e.code === FirebaseAuthErrorEnum.InUse) {
        Alert.alert(MessagesConstants.EmailInUse);
      }
      if (e.code === FirebaseAuthErrorEnum.InvalidEmail) {
        Alert.alert(MessagesConstants.EmailInvalid);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <Image style={styles.logo} source={require('../../assets/icon3.png')} />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#aaaaaa"
          onChangeText={setUsername}
          value={username}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableWithoutFeedback
          style={styles.birthdatePicker}
          onPress={showDatepicker}>
          <View style={styles.birthdatePicker}>
            <Image
              style={styles.birthdatePhoto}
              source={require('../../assets/icon-calendar.png')}
            />
            <Text> {getDate()}</Text>
          </View>
        </TouchableWithoutFeedback>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthdate}
            mode={mode}
            minimumDate={minDate}
            maximumDate={defaultDate}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#aaaaaa"
          onChangeText={setEmail}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry={true}
          placeholder="Contraseña"
          onChangeText={setPassword}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirmar contraseña"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
          <Text style={styles.buttonTitle}>Crear cuenta</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Iniciar sesión
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {},
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: 'center',
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.white,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: colors.primary,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#2e2e2d',
  },
  footerLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  birthdatePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    height: 48,
  },
  birthdateButton: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  birthdateText: {
    backgroundColor: colors.primary,
    width: '30%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  birthdatePhoto: {
    height: 40,
    width: 40,
  },
});
