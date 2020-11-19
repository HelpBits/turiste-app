import React, { useState } from 'react';
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
} from 'react-native';

import { colors } from "../styles/theme";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  let [email, handleEmail] = useState('');
  let [password, handlePassword] = useState('');

  let login = () => {
    if (!email) {
      Alert.alert("Ingresa un correo valido")
    }
    if (!password) {
      Alert.alert("Ingresa tu contrasena")
    }
    if (email && password) {
      navigation.navigate('HomeScreen', { email: email });
    }
  };

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Image source={require('../../assets/icon3.png')} styles={styles.logo} />
        <View style={{ marginTop: 50 }}></View>
        <TextInput
          style={styles.input}
          onChangeText={handleEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#888888"
          autoCapitalize="none"
          returnKeyType="next"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={handlePassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#888888"
          autoCapitalize="none"
          returnKeyType="done"
          textContentType="password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={login} style={styles.loginButton}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginBottom: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 23,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 12,
    marginTop: 10,
    width: 150,
    alignItems: 'center',
    borderRadius: 20,
  },
  input: {
    margin: 10,
    padding: 10,
    height: 40,
    width: width - (width - 256),
    borderColor: '#888888',
    borderWidth: 1,
    borderRadius: 50,
  },
});

export default LoginScreen;
