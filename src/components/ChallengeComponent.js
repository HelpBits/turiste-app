import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles/theme';

const ChallengeComponent = ({ navigation, challenge }) => {
  console.log('CHALLENGE', challenge);

  return (
    <View style={styles.card}>
      <Image
        style={styles.cardImage}
        source={{
          uri:
            challenge.photo && challenge.photo.url !== ''
              ? challenge.photo.url
              : require('../../assets/no-image.jpg'),
        }}
      />
      <View style={styles.cardHeader}>
        <Text style={styles.challengeTitle}>{challenge.name}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ChallengeMap', {
              challengeId: challenge.id,
              title: challenge.name,
            });
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
    backgroundColor: colors.background1,
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
    borderRadius: 3,
  },
  cardHeader: {
    marginTop: 5,
    flex: 0.5,
  },
  cardImage: {
    flex: 0.5,
    height: 200,
    backgroundColor: colors.black,
  },
  summaryHeader: {
    backgroundColor: colors.grey,
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
