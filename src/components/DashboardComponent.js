import React from 'react';
import { TouchableHighlight, StyleSheet, Text, View } from 'react-native';
import {colors} from '../styles/theme';


const DashboardComponent = ({
  setModalVisible,
  modalVisible,
  selectedPoint,
  setSelectedPoint,
}) => {
  const closeModal = () => {
    setModalVisible(!modalVisible);
    setSelectedPoint(null);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{selectedPoint.name}</Text>
        <Text style={styles.modalText}>{selectedPoint.desc}</Text>
        <Text>Has visitado este lugar 8 veces</Text>
        <TouchableHighlight style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.textStyle}>Ocultar</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    marginBottom: 0,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    height: '80%',
  },
  closeButton: {
    backgroundColor: colors.grey,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '80%',
  },
  textStyle: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
  },
});

export default DashboardComponent;
