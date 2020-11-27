import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {colors} from '../styles/theme';

const ChallengeComponent = ({navigation, challenge}) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.cardImage}
        source={{
          uri: challenge.photo
            ? challenge.photo.url
            : 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pngall.com%2Fwp-content%2Fuploads%2F2016%2F05%2FNature-Free-Download-PNG-180x180.png&f=1&nofb=1',
        }}
      />
      <View style={styles.cardHeader}>
        <Text style={styles.challengeTitle}>{challenge.name}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ChallengeMap', {challengeId: challenge.id});
          }}>
          <Text style={styles.buttonTitle}>Ver en mapa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: 'gray',
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
    borderRadius: 3,
  },
  cardHeader: {
    flex: 0.5,
  },
  cardImage: {
    flex: 0.5,
    height: 200,
    backgroundColor: 'black',
  },
  summaryHeader: {
    backgroundColor: 'gray',
    alignItems: 'flex-start',
  },
  challengeTitle: {
    fontSize: 20,
  },
  challengeDescription: {
    marginTop: 5,
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
});

export default ChallengeComponent;
