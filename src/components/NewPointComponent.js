import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from 'react-native';

const NewPointComponent = ({ setShowPointModalCreation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');
  const [photo, setPhoto] = useState('');

  const addNewPoint = () => {
    Alert.alert('nice');
  };

  return (
    <View style={styles.mainView}>
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
    marginTop: '50%',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
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
  actionButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default NewPointComponent;
