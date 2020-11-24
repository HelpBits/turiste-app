import React from 'react';
import { TouchableHighlight, StyleSheet, Text, View } from 'react-native';

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
        <Text style={styles.modalText}>{selectedPoint.point.toString()}</Text>
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
    backgroundColor: 'white',
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
    backgroundColor: 'gray',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '80%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default DashboardComponent;
