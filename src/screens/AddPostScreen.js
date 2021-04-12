import React, { useState, useEffect } from 'react';
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@ui-kitten/components';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { withFirebaseHOC } from '../utils';
import { colors } from '../styles/theme';

const ErrorEnum = {
  PHOTO: 0,
  DESCRIPTION: 1,
};

const MAX_CHARS = 500;
const AddPost = ({ firebase, challengePoint, setShowPostCreationModal }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessages, setErrorMessages] = useState(['Foto es requerida', '']);
  const [dirtyInputs, setDirtyInputs] = useState([false, false]);
  const [canCreate, setCanCreate] = useState(false);

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

  const handleImageState = (value) => {
    setImage(value);
    setDirtyAtIndex(ErrorEnum.PHOTO, !!value);

    let message = '';
    if (!value) {
      message = 'Foto es requerida';
    }

    setErrorAtIndex(message, ErrorEnum.PHOTO);
  };

  const handleDescriptionState = (value) => {
    setDescription(value.trimStart());
    setDirtyAtIndex(ErrorEnum.DESCRIPTION, value.trim().length !== 0);

    let message = '';
    if (!value || value.trim().length === 0) {
      message = 'Descripción es requerida';
    } else if (value.length > MAX_CHARS) {
      message = `Máximo ${MAX_CHARS} caracteres`;
    }

    setErrorAtIndex(message, ErrorEnum.DESCRIPTION);
  };

  const setImageUrl = (reference) => {
    reference
      .getDownloadURL()
      .then((res) => {
        image.uri = res;
      })
      .catch((err) => console.log(err));
  };

  const uploadImageToStorage = (path) => {
    let reference = storage().ref(
      `media/photos/posts/${Math.floor(Date.now())}`,
    );
    let task = reference.putFile(path);

    task
      .then(() => {
        setImageUrl(reference);
      })
      .catch((e) => console.log('uploading image error => ', e));
  };

  const onSubmit = async () => {
    try {
      const post = {
        challengePointId: challengePoint.id,
        photo: image.uri,
        description: description,
      };

      await firebase.uploadPost(post);

      Alert.alert('Post subido correctamente');

      setImage(null);
      setDescription('');

      setShowPostCreationModal(false);
    } catch (e) {
      Alert.alert('Ha ocurrido un error al subir el post');
      console.error('ERROR UPLOADING POST', e);
    }
  };

  const selectImage = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        uploadImageToStorage(response.uri);
        handleImageState(source);
      }
    });
  };

  return (
    <ScrollView style={{ flex: 1, marginTop: 60 }}>
      <Text style={styles.postTitle}>
        Agregar nuevo post a feed de {challengePoint.name}
      </Text>
      <View>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
        ) : (
          <Button
            appearance="outline"
            status="primary"
            onPress={selectImage}
            style={styles.addImageBtn}>
            + Agrega una imagen
          </Button>
        )}
        {errorMessages[ErrorEnum.PHOTO] !== '' && (
          <Text style={styles.errorText}>{errorMessages[ErrorEnum.PHOTO]}</Text>
        )}
      </View>
      <View style={styles.postCommentContainer}>
        <TextInput
          multiline={true}
          placeholder="Escribe algo sobre tu visita..."
          style={styles.postComment}
          value={description}
          onChangeText={handleDescriptionState}
        />
        <Text>
          {description.length}/{MAX_CHARS}
        </Text>
        {errorMessages[ErrorEnum.DESCRIPTION] !== '' && (
          <Text style={styles.errorText}>
            {errorMessages[ErrorEnum.DESCRIPTION]}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.disabledButton}
          onPress={() => setShowPostCreationModal(false)}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canCreate}
          style={canCreate ? styles.button : styles.disabledButton}
          onPress={onSubmit}>
          <Text>Publicar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addImageBtn: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  image: {
    aspectRatio: 1,
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
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    justifyContent: 'center',
    backgroundColor: '#3366FF',
  },
  postTitle: {
    fontSize: 20,
    alignSelf: 'center',
    paddingBottom: 20,
  },
  postCommentContainer: {
    marginTop: 30,
  },
  postComment: {
    borderWidth: 1,
    width: '100%',
    padding: 5,
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: colors.red,
  },
});

export default withFirebaseHOC(AddPost);
