import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { color } from 'react-native-reanimated';
import { colors, globalStyleSheet } from '../styles/theme';

const AddScreen = ({ navigation }) => {
  return (
    <View style={styles.mainView}>
      <Text style={globalStyleSheet.title}>Agregar</Text>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          navigation.navigate('AddChallengePoint');
        }}>
        <Text style={styles.touchableText}>Agregar Punto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  touchable: {
    margin: 10,
    padding: 10,
    paddingHorizontal: '22%',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  touchableText: {
    fontWeight: 'bold',
  },
});

export default AddScreen;
