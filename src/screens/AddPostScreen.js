import React, { Component } from 'react';
import { Text, Image, View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Input, Layout } from '@ui-kitten/components';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { withFirebaseHOC } from '../utils';

class AddPost extends Component {
  state = { image: null, description: '' };

  onChangeDescription = (description) => {
    this.setState({ description });
  };

  setImageUrl = (reference) => {
    reference
      .getDownloadURL()
      .then((res) => {
        this.state.image.uri = res;
      })
      .catch((err) => console.log(err));
  };

  uploadImageToStorage = (path) => {
    let reference = storage().ref(
      `media/photos/posts/${Math.floor(Date.now())}`,
    );
    let task = reference.putFile(path);

    task
      .then(() => {
        this.setImageUrl(reference);
      })
      .catch((e) => console.log('uploading image error => ', e));
  };

  onSubmit = async () => {
    if (this.state.image === null) {
      Alert.alert('Primero elige una imagen para el post.');
      return;
    }
    if (this.state.description === '') {
      Alert.alert('Escribe algo sobre tu visita al lugar.');
      return;
    }
    try {
      console.log('this.state.image.uri', this.state.image.uri);

      const post = {
        challengePointId: this.props.challengePoint.id,
        photo: this.state.image.uri,
        description: this.state.description,
      };
      this.props.firebase.uploadPost(post);

      this.setState({
        image: null,
        description: '',
      });
    } catch (e) {
      console.error(e);
    }
  };

  selectImage = () => {
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
        this.uploadImageToStorage(response.uri);
        this.setState({
          image: source,
        });
      }
    });
  };

  render() {
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
          {this.state.image ? (
            <Image
              source={this.state.image}
              style={{ width: '100%', height: 300 }}
            />
          ) : (
              <Button
                appearance="outline"
                status="primary"
                onPress={this.selectImage}
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
            value={this.state.description}
            onChangeText={(description) =>
              this.onChangeDescription(description)
            }
          />
          <Layout style={styles.container} level="1">
            <Button
              style={styles.button}
              status="basic"
              onPress={() => this.props.setShowPostCreationModal(false)}>
              Cancelar
            </Button>
            <Button
              style={styles.button}
              status="success"
              onPress={this.onSubmit}>
              Publicar
            </Button>
          </Layout>
        </View>
      </ScrollView>
    );
  }
}

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
