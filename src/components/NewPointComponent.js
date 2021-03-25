import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Alert,
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
import { colors } from '../styles/theme';

const ErrorEnum = {
  NAME: 0,
  DESCRIPTION: 1,
  POINT: 2,
  PHOTO: 3,
};

const NewPointComponent = ({ setShowPointCreationModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newPointCoordinates, setNewPointCoordinates] = useState(null);
  const [showSelectPointModal, setShowSelectPointModal] = useState(false);
  const [showSelectTagsModal, setShowSelectTagsModal] = useState(false);

  const [errorMessages, setErrorMessages] = useState([
    'Nombre es requerido',
    'Descripción es requerida',
    'Punto es requerido',
    'Foto es requerida',
  ]);
  const [dirtyInputs, setDirtyInputs] = useState([false, false, false, false]);
  const [canCreate, setCanCreate] = useState(false);

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

  useEffect(() => {
    const noError = errorMessages.reduce((a, e) => a && e === '', true);
    const isDirty = dirtyInputs.reduce((a, e) => a && e, true);

    console.log('CAN CREATE? ', noError && isDirty, errorMessages, dirtyInputs);
    setCanCreate(noError && isDirty);
  }, [dirtyInputs, errorMessages]);

  const setErrorAtIndex = (errorMessage, index) => {
    let errorsTemp = [...errorMessages];
    errorsTemp[index] = errorMessage;

    setErrorMessages([...errorsTemp]);
  };

  const setDirtyAtIndex = (index, value) => {
    let dirtyInputsTemp = [...dirtyInputs];
    dirtyInputsTemp[index] = value;
    setDirtyInputs([...dirtyInputsTemp]);
  };

  const handleNameState = (value) => {
    setName(value.trimStart());
    setDirtyAtIndex(ErrorEnum.NAME, value.length !== 0);

    let message = '';
    if (!value || value.trim().length === 0) {
      message = 'Nombre es requerido';
    }

    setErrorAtIndex(message, ErrorEnum.NAME);
  };

  const handleDescriptionState = (value) => {
    setDescription(value.trimStart());
    setDirtyAtIndex(ErrorEnum.DESCRIPTION, value.length !== 0);

    let message = '';
    if (!value || value.trim().length === 0) {
      message = 'Descripción es requerida';
    }

    setErrorAtIndex(message, ErrorEnum.DESCRIPTION);
  };

  const handlePointState = (value) => {
    setNewPointCoordinates(value);
    setDirtyAtIndex(ErrorEnum.POINT, !!value);

    let message = '';
    if (!value) {
      message = 'Ubicación es requerida';
    }

    setErrorAtIndex(message, ErrorEnum.POINT);
  };

  const handlePhotoState = (value) => {
    setPhoto(value);
    setDirtyAtIndex(ErrorEnum.PHOTO, !!value);

    let message = '';
    if (!value) {
      message = 'Foto es requerida';
    }

    setErrorAtIndex(message, ErrorEnum.PHOTO);
  };

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
          handlePhotoState(response.uri);
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

    if (!photo) {
      Alert.alert('Agregue una foto para el nuevo punto');
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
          setNewPointCoordinates={handlePointState}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyle}
          onChangeText={handleNameState}
          placeholder="Nombre"
          value={name}
        />
        {errorMessages[ErrorEnum.NAME] !== '' && (
          <Text style={styles.errorText}>{errorMessages[ErrorEnum.NAME]}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyle}
          onChangeText={handleDescriptionState}
          placeholder="Descripcion"
          value={description}
        />
        {errorMessages[ErrorEnum.DESCRIPTION] !== '' && (
          <Text style={styles.errorText}>
            {errorMessages[ErrorEnum.DESCRIPTION]}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={{
            ...styles.selectPointTouchable,
            ...styles.inputStyle,
          }}
          onPress={() => setShowSelectPointModal(true)}>
          <View style={styles.selectPointContainer}>
            <Text>Seleccionar Punto</Text>
            <Icon name="map" color="red" style={{ marginLeft: 5 }} />
          </View>
        </TouchableOpacity>
        {errorMessages[ErrorEnum.POINT] !== '' && (
          <Text style={styles.errorText}>{errorMessages[ErrorEnum.POINT]}</Text>
        )}
      </View>

      <TouchableOpacity
        style={{
          ...styles.addPointTouchable,
          ...styles.inputStyle,
          ...styles.inputContainer,
        }}
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

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={{
            ...styles.addPointTouchable,
            ...styles.inputStyle,
          }}
          onPress={selectPhotoFromLibrary}>
          <Text>Agregar Foto</Text>
          <Icon name="image" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
        {errorMessages[ErrorEnum.PHOTO] !== '' && (
          <Text style={styles.errorText}>{errorMessages[ErrorEnum.PHOTO]}</Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: colors.lightGray }}
          onPress={() => setShowPointCreationModal(false)}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canCreate}
          style={canCreate ? styles.button : styles.disabledButton}
          onPress={addNewPoint}>
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
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
  },
  selectPointContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    width: '100%',
  },
  inputStyle: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.white,
    paddingLeft: 10,
    borderWidth: 1,
  },
  addPointTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 5,
    width: '100%',
  },
  selectPointTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: colors.white,
    width: '100%',
    marginTop: 10,
  },
  errorText: {
    color: colors.red,
  },
  actionButtons: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: colors.grey,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  button: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  tagChip: {
    borderRadius: 10,
    backgroundColor: colors.lightGray,
    margin: 1,
    padding: 5,
    flexDirection: 'row',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  chipText: { marginLeft: 5 },
});

export default NewPointComponent;
