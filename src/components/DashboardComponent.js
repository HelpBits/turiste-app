import React from 'react';
import {
  TouchableHighlight,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const DashboardComponent = ({ setModalVisible, modalVisible, selectedPoint }) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{selectedPoint.name}</Text>
        <Text style={styles.modalText}>{selectedPoint.point.toString()}</Text>

        <TouchableHighlight
          style={styles.closeButton}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
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
    width: width,
    height: height - 256,
  },
  closeButton: {
    backgroundColor: 'gray',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: width - 256,
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
