import React, { useState } from 'react';
import NewPointComponent from '../components/NewPointComponent';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../styles/theme';
import { globalStyleSheet } from '../styles/theme';

const AddScreen = ({ navigation }) => {
  const [newPointModalVisible, setNewPointModalVisible] = useState(false);

  return (
    <View
      style={{
        ...styles.mainView,
        paddingTop: Platform.OS === 'ios' ? 50 : 0,
      }}>
      <Text style={globalStyleSheet.title}>Agregar contenido</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AgregarPunto')}>
        <Text style={styles.touchableText}>Agregar Punto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { flex: 1, padding: 10 },
  touchable: {
    margin: 10,
    padding: 10,
    paddingHorizontal: '22%',
    justifyContent: 'center',
    borderColor: 'orange',
    backgroundColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius: 10,
  },
  touchableText: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.primary,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddScreen;
