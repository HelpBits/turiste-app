import React, { useState, useEffect } from 'react';
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFooterLinkPress = () => {
    navigation.navigate('SignUpScreen');
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const onLoginPress = async () => {
    if (!email) {
      Alert.alert('Correo es requerido.');
      return;
    }

    if (!validations.validateEmail(email)) {
      Alert.alert('Formato de correo incorrecto');
      return;
    }

    if (!password) {
      Alert.alert('Contraseña es requerida');
      return;
    }

    try {
      const login = await auth().signInWithEmailAndPassword(email, password);
      if (login.user) {
        navigation.navigate('HomeScreen');
      }
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
          placeholder="Correo"
          placeholderTextColor="#aaaaaa"
          onChangeText={setEmail}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          returnKeyType="next"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Contraseña"
          onChangeText={setPassword}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
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
    backgroundColor: 'white',
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
});
