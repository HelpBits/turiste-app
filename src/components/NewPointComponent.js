import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { globalStyleSheet } from '../styles/theme';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import SelectNewPointComponent from '../components/SelectNewPointComponent';
import MultiselectComponent from '../components/MultiSelectComponent';
import { MFChallengePoint } from '../firebase/collections/MFChallengePoint';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import { showMessage } from '../utils/showMessage';
import { MessageTypeEnum } from '../constants/MessageTypeEnum';

const NewPointComponent = ({ setShowPointCreationModal }) => {
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newPointCoordinates, setNewPointCoordinates] = useState(null);
  const [showSelectPointModal, setShowSelectPointModal] = useState(false);
  const [showSelectTagsModal, setShowSelectTagsModal] = useState(false);

  const tagModel = firestore().collection(FirebaseCollectionEnum.MFLabel);
  const points = firestore().collection(
    FirebaseCollectionEnum.MFChallengePoint,
  );

  const setImageUrl = (reference) => {
    reference
      .getDownloadURL()
      .then((res) => setPhoto(res))
      .catch((err) => console.log('error on setImageUrl method', err));
  };

  const uploadImageToStorage = (path) => {
    const reference = storage().ref(
      `media/photos/${Math.floor(Math.random() * 100000000 + 1)}`,
    );
    const task = reference.putFile(path);
    task
      .then(() => {
        setImageUrl(reference);
      })
      .catch((error) => console.log('error uploading image:', error));
  };

  useEffect(() => {
    tagModel.onSnapshot(async (snapshot) => {
      setTags(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }),
      );
    });
    setSelectedTags([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPhotoFromLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setPhoto(response.uri);
          uploadImageToStorage(response.uri);
        }
      },
      (error) => {
        console.log('error', error);
      },
    );
  };

  const addNewPoint = () => {
    const checkIns = [];
    const popularity = 0;
    const creationDate = new Date();
    const labels = selectedTags.map((tagId) =>
      tags.find((tag) => tag.id === tagId),
    );
    if (!name) {
      showMessage(
        'Ingrese un nombre para el nuevo punto',
        MessageTypeEnum.Error,
      );
      return;
    }
    if (!description) {
      showMessage(
        'Ingrese una descripción para el nuevo punto',
        MessageTypeEnum.Error,
      );
      return;
    }
    if (!photo) {
      showMessage(
        'Agregue una foto para el nuevo punto',
        MessageTypeEnum.Error,
      );
      return;
    }
    if (!newPointCoordinates) {
      showMessage('Seleccione un punto en el mapa', MessageTypeEnum.Error);
      return;
    }
    const geometry = {
      latitude: newPointCoordinates[0],
      longitude: newPointCoordinates[1],
    };
    const newPoint = new MFChallengePoint(
      name,
      description,
      geometry,
      popularity,
      photo,
      labels,
      checkIns,
      creationDate,
    );
    points
      .add(newPoint)
      .then(() => {
        showMessage('Punto Creado', MessageTypeEnum.Success);
        setShowPointCreationModal(false);
      })
      .catch(() => {
        showMessage('Error al crear el punto', MessageTypeEnum.Error);
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
      <Modal isVisible={showSelectTagsModal}>
        <MultiselectComponent
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          setShowSelectTagsModal={setShowSelectTagsModal}
        />
      </Modal>
      <Text style={globalStyleSheet.title}>Información del Nuevo Punto</Text>
      <TouchableOpacity
        style={styles.selectPointTouchable}
        onPress={() => setShowSelectPointModal(true)}>
        <Text>Seleccionar Punto</Text>
        <Icon name="map" color="red" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.addPointTouchable}
        onPress={() => setShowSelectTagsModal(true)}>
        <Text>Etiquetas</Text>
        <Icon name="tag" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
      <View style={styles.tagsContainer}>
        {selectedTags &&
          selectedTags
            .map((tagId) => tags.find((tag) => tag.id === tagId).name)
            .map((tag) => (
              <View style={styles.tagChip} key={tag}>
                <Icon name="tag" size={10} color="white" />
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
      </View>
      <TouchableOpacity
        style={styles.addPointTouchable}
        onPress={selectPhotoFromLibrary}>
        <Text>Agregar Foto</Text>
        <Icon name="image" style={{ marginLeft: 5 }} />
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
    alignItems: 'center',
  },
  inputStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '85%',
    padding: 5,
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  touchable: {
    width: '40%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    borderWidth: 0.3,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  addPointTouchable: {
    backgroundColor: 'white',
    width: '85%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 0.3,
    borderRadius: 10,
    marginHorizontal: 10,
    margin: 5,
  },
  selectPointTouchable: {
    backgroundColor: 'white',
    width: '85%',
    height: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'green',
    borderWidth: 0.3,
    borderRadius: 10,
    marginHorizontal: 10,
    margin: 5,
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', width: '75%' },
  tagChip: {
    borderRadius: 10,
    backgroundColor: 'gray',
    margin: 1,
    padding: 3,
    flexDirection: 'row',
  },
  chipText: { color: 'white', marginLeft: 1 },
});

export default NewPointComponent;
