import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
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
import { ScrollView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';

const ErrorEnum = {
  NAME: 0,
  DESCRIPTION: 1,
  POINT: 2,
  PHOTO: 3,
};

const NewPointComponent = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newPointCoordinates, setNewPointCoordinates] = useState(null);
  const [showSelectPointModal, setShowSelectPointModal] = useState(false);
  const [showSelectTagsModal, setShowSelectTagsModal] = useState(false);

  const [errorMessages, setErrorMessages] = useState(['', '', '', '']);
  const [dirtyInputs, setDirtyInputs] = useState([false, false, false, false]);
  const [canCreate, setCanCreate] = useState(false);

  const tagModel = firestore().collection(FirebaseCollectionEnum.MFLabel);
  const points = firestore().collection(
    FirebaseCollectionEnum.MFChallengePoint,
  );

  const setImageUrl = (reference) => {
    reference
      .getDownloadURL()
      .then((res) => {
        handlePhotoState({ uri: res });
      })
      .catch((err) => console.log('error on setImageUrl method', err));
  };

  const uploadImageToStorage = (source) => {
    const { uri } = source;
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const fileExtension = uri.substring(uri.lastIndexOf('.') + 1);
    const random = uuid.v4(); // ⇨ '11edc52b-2918-4d71-9058-f7285e29d894'
    const filename = `${random}_${Math.floor(Date.now())}.${fileExtension}`;

    console.log('UPLOAD URI', uploadUri, 'FILENAME', filename);
    const reference = storage().ref(`media/photos/points/${filename}`);
    const task = reference.putFile(uploadUri);

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
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(
      options,
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          uploadImageToStorage(response);
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
      photo.uri,
      labels,
      checkIns,
      creationDate,
    );
    points
      .add(newPoint)
      .then(() => {
        Alert.alert('Punto Creado');
        navigation.goBack();
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
      <ScrollView>
        <View style={styles.inputContainer}>
          <View>
            {!photo && (
              <Image
                source={require('../../assets/no-image.jpeg')}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            {photo && (
              <Image source={photo} style={styles.image} resizeMode="contain" />
            )}
          </View>

          <TouchableOpacity
            style={{
              ...styles.addPointTouchable,
              ...styles.inputStyle,
            }}
            onPress={selectPhotoFromLibrary}>
            <Text>Agregar Foto*</Text>
            <Icon name="image" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
          {errorMessages[ErrorEnum.PHOTO] !== '' && (
            <Text style={styles.errorText}>
              {errorMessages[ErrorEnum.PHOTO]}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Nombre*"
            placeholderTextColor="#aaaaaa"
            onChangeText={handleNameState}
            underlineColorAndroid="transparent"
            value={name}
          />
          {errorMessages[ErrorEnum.NAME] !== '' && (
            <Text style={styles.errorText}>
              {errorMessages[ErrorEnum.NAME]}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={handleDescriptionState}
            placeholder="Descripción*"
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
              <Text>Seleccionar Punto*</Text>
              <Icon name="map" color="red" style={{ marginLeft: 5 }} />
            </View>
          </TouchableOpacity>
          {errorMessages[ErrorEnum.POINT] !== '' && (
            <Text style={styles.errorText}>
              {errorMessages[ErrorEnum.POINT]}
            </Text>
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
        <Text style={styles.requiredStyle}>Campos requeridos *</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            disabled={!canCreate}
            style={canCreate ? styles.button : styles.disabledButton}
            onPress={addNewPoint}>
            <Text>Agregar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  selectPointContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 10,
  },
  inputStyle: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.white,
    paddingLeft: 10,
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
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    marginTop: 20,
    height: 48,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  image: {
    aspectRatio: 1,
    height: 300,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  requiredStyle: {
    color: colors.red,
  },
});

export default NewPointComponent;
