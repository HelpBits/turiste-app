import React, {useState} from 'react';
import NewPointComponent from '../components/NewPointComponent';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {globalStyleSheet} from '../styles/theme';

const AddScreen = () => {
  const [newPointModalVisible, setNewPointModalVisible] = useState(false);

  return (
    <View style={styles.mainView}>
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropColor="white"
        backdropOpacity={1}
        isVisible={newPointModalVisible}>
        <NewPointComponent
          setShowPointCreationModal={setNewPointModalVisible}
        />
      </Modal>
      <Text style={globalStyleSheet.title}>AGREGAR</Text>
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
  mainView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
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
});

export default AddScreen;
