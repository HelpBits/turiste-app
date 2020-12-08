import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {globalStyleSheet} from '../styles/theme';

const HelpScreen = () => {
  const developersEmails = [
    'geraldvindasa@gmail.com',
    'delgadocarlos401@pm.me',
    'juanignacioco@gmail.com',
    'academicsgeovanny@gmail.com',
  ];
  return (
    <View style={styles.mainView}>
      <Text style={globalStyleSheet.title}>AYUDA</Text>
      <Text style={styles.subTitle}>Desarrolladores</Text>
      {developersEmails.map((email) => (
        <Text key={email} style={styles.emailText}>
          {email}
        </Text>
      ))}

      <Image style={styles.logo} source={require('../../assets/icon3.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  subTitle: {fontWeight: 'bold', marginVertical: 15},
  emailText: {margin: 10},
  logo: {marginTop: 30},
});
export default HelpScreen;
