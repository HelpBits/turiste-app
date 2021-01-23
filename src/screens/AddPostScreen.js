import React, { useState } from 'react';
import { Text, Image, View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Input, Layout } from '@ui-kitten/components';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { withFirebaseHOC } from '../utils';

const AddPost = ({ firebase, challengePoint, setShowPostCreationModal }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

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
    if (image === null) {
      Alert.alert('Primero elige una imagen para el post.');
      return;
    }
    if (description === '') {
      Alert.alert('Escribe algo sobre tu visita al lugar.');
      return;
    }
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
        setImage(source);
      }
    });
  };

  return (
    <ScrollView style={{ flex: 1, marginTop: 60 }}>
      <Text
        style={{
          fontSize: 20,
          alignSelf: 'center',
          paddingBottom: 20,
        }}>
        Agregando un nuevo post al feed
      </Text>
      <View>
        {image ? (
          <Image source={image} style={{ width: '100%', height: 300 }} />
        ) : (
            <Button
              appearance="outline"
              status="primary"
              onPress={selectImage}
              style={{
                alignItems: 'center',
                padding: 10,
                margin: 20,
              }}>
              + Agrega una imagen
            </Button>
          )}
      </View>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Input
          multiline={true}
          placeholder="Escribe algo sobre tu visita..."
          style={{
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 30,
          }}
          value={description}
          onChangeText={(value) => setDescription(value)}
        />
        <Layout style={styles.container} level="1">
          <Button
            style={styles.button}
            status="basic"
            onPress={() => setShowPostCreationModal(false)}>
            Cancelar
          </Button>
          <Button style={styles.button} status="success" onPress={onSubmit}>
            Publicar
          </Button>
        </Layout>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 2,
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    justifyContent: 'center',
    backgroundColor: '#3366FF',
  },
});

export default withFirebaseHOC(AddPost);
