import React, { useCallback } from 'react';
import { Text, View, Image, StyleSheet, Linking, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { colors, globalStyleSheet } from '../styles/theme';

const HelpScreen = () => {
  const UserGuideUrl = 'https://github.com/HelpBits/docs/wiki';
  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      console.log('url ==> ', url);
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableHighlight onPress={handlePress} style={styles.touchable}>
        <Text style={styles.textLink}>{children}</Text>
      </TouchableHighlight>
    );
  };
  const developersEmails = [
    'geraldvindasa@gmail.com',
    'delgadocarlos401@pm.me',
    'juanignacioco@gmail.com',
    'academicsgeovanny@gmail.com',
  ];
  return (
    <View
      style={{ ...styles.mainView, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
      <Text style={globalStyleSheet.title}>Acerca de</Text>
      <Text style={styles.subTitle}>Manual de usuario</Text>
      <OpenURLButton url={`${UserGuideUrl}`}>{UserGuideUrl}</OpenURLButton>
      <Text style={styles.subTitle}>Desarrolladores</Text>
      {developersEmails.map((email) => (
        <OpenURLButton key={email} url={`mailto:${email}`}>
          {email}
        </OpenURLButton>
      ))}

      <Image style={styles.logo} source={require('../../assets/icon3.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { flex: 1, padding: 10 },
  subTitle: { fontWeight: 'bold', paddingTop: 10 },
  emailText: { margin: 10 },
  logo: { marginTop: 30, alignSelf: 'center' },
  touchable: {
    paddingTop: 10,
  },
  textLink: {
    color: colors.primary,
    paddingLeft: 10,
  },
});
export default HelpScreen;
