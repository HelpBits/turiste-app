import React, { useState } from 'react';
import NewPointComponent from '../components/NewPointComponent';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { globalStyleSheet } from '../styles/theme';

const AddScreen = () => {
  const [newPointModalVisible, setNewPointModalVisible] = useState(false);

  return (
    <View style={styles.mainView}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={newPointModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <NewPointComponent
          setShowPointCreationModal={setNewPointModalVisible}
        />
      </Modal>
      <Text style={globalStyleSheet.title}>agregar</Text>
      <Text style={{ marginVertical: 10 }}>que comience la diversion u.u</Text>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setNewPointModalVisible(true)}>
        <Text style={styles.touchableText}>Agregar Punto</Text>
      </TouchableOpacity>
      <TouchableOpacity disabled style={styles.touchable}>
        <Text style={styles.touchableText}>Agregar Reto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  touchable: {
    margin: 10,
    padding: 10,
    paddingHorizontal: '20%',
    justifyContent: 'center',
    borderColor: 'orange',
    borderWidth: 1,
  },
  touchableText: {
    fontWeight: 'bold',
  },
});

export default AddScreen;
