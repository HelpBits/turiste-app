import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import SelectNewPointComponent from '../components/SelectNewPointComponent';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import { MFChallengePoint } from '../firebase/collections/MFChallengePoint';
import Icon from 'react-native-vector-icons/FontAwesome5';

const NewPointComponent = ({ setShowPointModalCreation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');
  const [photo, setPhoto] = useState('');
  const [newPoinCoordinates, setNewPoinCoordinates] = useState(null);
  const [showChoosePointModal, setShowChoosePointModal] = useState(false);

  const points = firestore().collection(
    FirebaseCollectionEnum.MFChallengePoint,
  );

  const addNewPoint = () => {
    console.log(newPoinCoordinates);
    const geometry = {
      latitude: newPoinCoordinates[0],
      longitude: newPoinCoordinates[1],
    };
    const creationDate = moment().toISOString();
    const newPoint = new MFChallengePoint(
      name,
      description,
      photo,
      geometry,
      labels.split(','),
      creationDate,
    );

    points
      .add(newPoint)
      .then(() => {
        Alert.alert('Point created');
        setShowPointModalCreation(false);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Error on point creation');
      });
  };

  return (
    <View style={styles.mainView}>
      <Modal
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
        visible={showChoosePointModal}>
        <SelectNewPointComponent
          setShowChoosePointModal={setShowChoosePointModal}
          newPoinCoordinates={newPoinCoordinates}
          setNewPoinCoordinates={setNewPoinCoordinates}
        />
      </Modal>
      <Text style={{ marginVertical: 30 }}>Informacion de Nuevo Punto</Text>
      <TextInput
        style={styles.inputStyle}
        onChangeText={setName}
        placeholder="Nombre"
        value={name}
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={setDescription}
        placeholder="Descripcion"
        value={description}
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={setLabels}
        placeholder="Etiquetas"
        value={labels}
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={setPhoto}
        placeholder="Foto"
        value={photo}
      />
      <TouchableOpacity
        style={styles.addPointTouchable}
        onPress={() => setShowChoosePointModal(true)}>
        <Text>Seleccionar punto</Text>
        <Icon name="map" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setShowPointModalCreation(false)}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable} onPress={addNewPoint}>
          <Text>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    margin: 20,
    marginTop: '40%',
    height: '60%',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 30,
    alignItems: 'center',
  },
  inputStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '75%',
    padding: 5,
    margin: 5,
    borderRadius: 10,
  },
  touchable: {
    width: '30%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    borderColor: 'red',
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  addPointTouchable: {
    width: '75%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // backgroundColor: 'green',
    borderColor: 'red',
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default NewPointComponent;
