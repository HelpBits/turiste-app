import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
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
import validations from '../utils/validation';

const users = firestore().collection(FirebaseCollectionEnum.MFUser);
const roles = firestore().collection(FirebaseCollectionEnum.MFRole);

const ErrorEnum = {
  USERNAME: 0,
  BIRTHDATE: 1,
  MAIL: 2,
  PASSWORD: 3,
  CONFIRM_PASSWORD: 4,
};

export default function RegistrationScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState(['', '', '', '', '']);
  const [dirtyInputs, setDirtyInputs] = useState([
    false,
    true,
    false,
    false,
    false,
  ]);
  const [canCreate, setCanCreate] = useState(false);
  const [checkInputs, setCheckInputs] = useState(false);

  const [birthdate, setBirthdate] = useState(
    new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  );

  useEffect(() => {
    const noError = errorMessages.reduce((a, e) => a && e === '', true);
    const isDirty = dirtyInputs.reduce((a, e) => a && e, true);

    setCanCreate(noError && isDirty);
  }, [dirtyInputs, errorMessages]);

  useEffect(() => {
    let message = '';
    if (password !== confirmPassword) {
      message = 'Contraseñas no coinciden';
    }

    setErrorAtIndex(message, ErrorEnum.CONFIRM_PASSWORD);
  }, [confirmPassword, password, setErrorAtIndex]);

  useEffect(() => {
    let messages = [...errorMessages];

    if (!username) {
      messages[ErrorEnum.USERNAME] = 'error';
    }

    if (!birthdate) {
      messages[ErrorEnum.BIRTHDATE] = 'error';
    }

    if (!email) {
      messages[ErrorEnum.MAIL] = 'error';
    }

    if (!password) {
      messages[ErrorEnum.PASSWORD] = 'error';
    }

    if (!confirmPassword) {
      messages[ErrorEnum.CONFIRM_PASSWORD] = 'error';
    }

    setCanCreate(messages.reduce((a, e) => a && e, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkInputs]);

  const onFooterLinkPress = () => {
    navigation.navigate('LoginScreen');
  };

  const setErrorAtIndex = useCallback((errorMessage, index) => {
    let errorsTemp = [...errorMessages];
    errorsTemp[index] = errorMessage;

    setErrorMessages([...errorsTemp]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDirtyAtIndex = (index, value) => {
    let dirtyInputsTemp = [...dirtyInputs];
    dirtyInputsTemp[index] = value;
    setDirtyInputs([...dirtyInputsTemp]);
  };

  const handleUsernameState = (value) => {
    setUsername(value.trim());
    setDirtyAtIndex(ErrorEnum.USERNAME, value.length !== 0);

    let message = '';
    if (!value || value.trim() === '') {
      message = 'Usuario es requerido';
    }

    setErrorAtIndex(message, ErrorEnum.USERNAME);
  };

  const handleBirthdateState = (value) => {
    // format date
    let newDate = value.trim();
    let dateArray = [...newDate];

    const deleting = newDate.length < birthdate.length;
    if (dateArray.length === 2 && dateArray[1] !== '/' && !deleting) {
      dateArray.push('/');
    }

    if (dateArray.length === 5 && dateArray[4] !== '/' && !deleting) {
      dateArray.push('/');
    }

    setBirthdate(dateArray.join('').trim());
    setDirtyAtIndex(ErrorEnum.BIRTHDATE, value.length !== 0);

    let message = '';
    const dateInFormat =
      newDate.substring(3, 6) + newDate.substring(0, 3) + newDate.substring(6);
    if (!newDate || newDate.length === 0) {
      message = 'Fecha de nacimiento es requerida';
    } else if (newDate.length !== 10) {
      message = 'La fecha no cumple con el formato DD/MM/YYYY';
    } else if (isNaN(new Date(dateInFormat))) {
      message = 'La fecha no es válida';
    } else if (new Date(newDate) > new Date()) {
      message = 'La fecha es mayor que la fecha actual';
    }

    setErrorAtIndex(message, ErrorEnum.BIRTHDATE);
  };

  const handleEmailState = (value) => {
    setEmail(value.trim());
    setDirtyAtIndex(ErrorEnum.MAIL, value.length !== 0);

    let message = '';
    if (!value || value.length === 0) {
      message = 'Email es requerido';
    } else if (!validations.validateEmail(email)) {
      message = 'Formato de correo incorrecto';
    }

    setErrorAtIndex(message, ErrorEnum.MAIL);
  };

  const handlePasswordState = (value) => {
    setPassword(value);
    setDirtyAtIndex(ErrorEnum.PASSWORD, value.length !== 0);

    let message = '';
    if (!value) {
      message = 'Contraseña es requerida';
    } else if (value.length < 6) {
      message = 'Contraseña debe tener al menos 6 caracteres';
    } else if (value.length > 15) {
      message = 'Contraseña debe tener máximo 15 caracteres';
    }

    setErrorAtIndex(message, ErrorEnum.PASSWORD);
  };

  const handleConfirmPasswordState = (value) => {
    setConfirmPassword(value);
    setDirtyAtIndex(ErrorEnum.CONFIRM_PASSWORD, value.length !== 0);

    let message = '';
    if (value !== password) {
      message = 'Contraseñas no coinciden';
    }

    setErrorAtIndex(message, ErrorEnum.CONFIRM_PASSWORD);
  };

  const onRegisterPress = async () => {
    if (!email || !birthdate || !email || !password || !confirmPassword) {
      setCheckInputs(!checkInputs);
      return;
    }

    try {
      const register = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      if (register.user) {
        roles.onSnapshot(async (snapshot) => {
          const rolesCollection = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));

          const userRole = rolesCollection.filter(
            (role) => role.name === RolesEnum.User,
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

          await users.doc(register.user.uid).set(newUser);
          Alert.alert('Usuario registrado');
          // navigation.navigate('LoginScreen');
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#aaaaaa"
            onChangeText={handleUsernameState}
            value={username}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          {errorMessages[ErrorEnum.USERNAME] !== '' && (
            <Text style={styles.errorText}>
              {' '}
              {errorMessages[ErrorEnum.USERNAME]}
            </Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (DD/MM/YYYY)"
            placeholderTextColor="#aaaaaa"
            onChangeText={handleBirthdateState}
            value={birthdate}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            keyboardType="numeric"
          />

          {errorMessages[ErrorEnum.BIRTHDATE] !== '' && (
            <Text style={styles.errorText}>
              {errorMessages[ErrorEnum.BIRTHDATE]}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#aaaaaa"
            onChangeText={handleEmailState}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          {errorMessages[ErrorEnum.MAIL] !== '' && (
            <Text style={styles.errorText}>
              {errorMessages[ErrorEnum.MAIL]}
            </Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry={true}
            placeholder="Contraseña"
            onChangeText={handlePasswordState}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          {errorMessages[ErrorEnum.PASSWORD] !== '' && (
            <Text style={styles.errorText}>
              {errorMessages[ErrorEnum.PASSWORD]}
            </Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Confirmar contraseña"
            onChangeText={handleConfirmPasswordState}
            value={confirmPassword}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          {errorMessages[ErrorEnum.CONFIRM_PASSWORD] !== '' && (
            <Text style={styles.errorText}>
              {errorMessages[ErrorEnum.CONFIRM_PASSWORD]}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={canCreate ? styles.button : styles.disabledButton}
          disabled={!canCreate}
          onPress={onRegisterPress}>
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
    paddingLeft: 10,
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  errorText: {
    color: colors.red,
  },
  disabledButton: {
    backgroundColor: colors.grey,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  birthdatePhoto: {
    height: 40,
    width: 40,
  },
});
