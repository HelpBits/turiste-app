import React, {useState} from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../styles/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import {RolesEnum} from '../constants/RoleEnum';
import {MFUser} from '../firebase/collections/MFUser';

const users = firestore().collection(FirebaseCollectionEnum.MFUser);
const roles = firestore().collection(FirebaseCollectionEnum.MFRole);

export default function RegistrationScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onFooterLinkPress = () => {
    navigation.navigate('LoginScreen');
  };

  const onRegisterPress = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    try {
      const register = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      if (register.user) {
        roles.onSnapshot(async(snapshot) => {
          const rolesCollection = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));

          const userRole = rolesCollection.filter(
            (role) => (role.name == RolesEnum.User),
          );
          
          const newUser = new MFUser(email, username, false, userRole[0], [], []);
           
          await users.add(newUser);
          navigation.navigate('LoginScreen');
        });

      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <Image style={styles.logo} source={require('../../assets/icon3.png')} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setUsername(text)}
          value={username}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}>
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

import {StyleSheet} from 'react-native';

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
