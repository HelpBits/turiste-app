import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../styles/theme';
import auth from '@react-native-firebase/auth';
import validations from '../utils/validation';

import { FirebaseAuthErrorEnum } from '../constants/FirebaseAuthErrorEnum';
import { MessagesConstants } from '../constants/MessagesConstants';

const ErrorEnum = {
  MAIL: 0,
  PASSWORD: 1,
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [canCreate, setCanCreate] = useState(false);
  const [errorMessages, setErrorMessages] = useState(['', '']);
  const [dirtyInputs, setDirtyInputs] = useState([false, false]);

  useEffect(() => {
    const noError = errorMessages.reduce((a, e) => a && e === '', true);
    const isDirty = dirtyInputs.reduce((a, e) => a && e, true);

    setCanCreate(noError && isDirty);
  }, [dirtyInputs, errorMessages]);

  const setErrorAtIndex = (errorMessage, index) => {
    let errorsTemp = [...errorMessages];
    errorsTemp[index] = errorMessage;

    setErrorMessages([...errorsTemp]);
  };

  const setDirtyAtIndex = (index, value) => {
    let dirtyInputsTemp = [...dirtyInputs];
    dirtyInputsTemp[index] = value;
    setDirtyInputs([...dirtyInputsTemp]);
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

  const onFooterLinkPress = () => {
    navigation.navigate('SignUpScreen');
  };

  const onLoginPress = async () => {
    if (!email && !password) {
      Alert.alert('Todos los campos son requeridos');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      if (e.code === FirebaseAuthErrorEnum.InUse) {
        Alert.alert(MessagesConstants.EmailInUse);
      }

      if (e.code === FirebaseAuthErrorEnum.InvalidEmail) {
        Alert.alert(MessagesConstants.EmailInvalid);
      }

      if (e.code === FirebaseAuthErrorEnum.UserNotFound) {
        Alert.alert(MessagesConstants.EmailNotFound);
      }

      if (e.code === FirebaseAuthErrorEnum.WrongPassword) {
        Alert.alert(MessagesConstants.WrongPassword);
      }

      if (e.code === FirebaseAuthErrorEnum.TooManyRequests) {
        Alert.alert(MessagesConstants.TooManyRequest);
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
            placeholder="Correo"
            placeholderTextColor="#aaaaaa"
            onChangeText={handleEmailState}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="email-address"
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
            secureTextEntry
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

        <TouchableOpacity
          style={canCreate ? styles.button : styles.disabledButton}
          disabled={!canCreate}
          onPress={onLoginPress}>
          <Text style={styles.buttonTitle}>Iniciar sesión</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            ¿No tienes cuenta?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Crear cuenta
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: 'center',
    margin: 30,
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  input: {
    height: 48,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
  },
  errorText: {
    color: colors.red,
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
});
