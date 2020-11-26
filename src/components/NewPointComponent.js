import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { globalStyleSheet } from '../styles/theme';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import SelectNewPointComponent from '../components/SelectNewPointComponent';
import { MFChallengePoint } from '../firebase/collections/MFChallengePoint';
import Modal from 'react-native-modal';

const NewPointComponent = ({ setShowPointCreationModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');
  const [photo, setPhoto] = useState('');
  const [newPointCoordinates, setNewPointCoordinates] = useState(null);
  const [showSelectPointModal, setShowSelectPointModal] = useState(false);

  const points = firestore().collection(
    FirebaseCollectionEnum.MFChallengePoint,
  );

  const addNewPoint = () => {
    const geometry = {
      latitude: newPointCoordinates[0],
      longitude: newPointCoordinates[1],
    };
    const creationDate = new Date();
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
        Alert.alert('Punto Creado');
        setShowPointCreationModal(false);
      })
      .catch(() => {
        Alert.alert('Error al crear el punto');
      });
  };

  return (
    <View style={styles.mainView}>
      <Modal
        testID={'modal'}
        isVisible={showSelectPointModal}
        backdropColor="#B4B3DB"
        backdropOpacity={0.3}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}>
        <SelectNewPointComponent
          setShowSelectPointModal={setShowSelectPointModal}
          newPointCoordinates={newPointCoordinates}
          setNewPointCoordinates={setNewPointCoordinates}
        />
      </Modal>
      <Text style={globalStyleSheet.title}>Informacion de Nuevo Punto</Text>
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
        onPress={() => setShowSelectPointModal(true)}>
        <Text>Seleccionar punto</Text>
        <Icon name="map" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setShowPointCreationModal(false)}>
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
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
    backgroundColor: 'white',
    width: '75%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
