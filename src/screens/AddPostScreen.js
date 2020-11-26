import React, { Component } from 'react';
import { Image, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, Button, Input } from 'react-native-ui-kitten';
import ImagePicker from 'react-native-image-picker';
import { withFirebaseHOC } from '../utils';

class AddPost extends Component {
  state = { image: null, description: '' };

  onChangeDescription = (description) => {
    this.setState({ description });
  };

  onSubmit = async () => {
    try {
      const post = {
        photo: this.state.image,
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
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log(source);
        this.setState({
          image: source,
        });
      }
    });
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, marginTop: 60 }}>
        <View>
          {this.state.image ? (
            <Image
              source={this.state.image}
              style={{ width: '100%', height: 300 }}
            />
          ) : (
              <Button
                onPress={this.selectImage}
                style={{
                  alignItems: 'center',
                  padding: 10,
                  margin: 30,
                }}>
                Elije una foto
              </Button>
            )}
        </View>
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text category="h4">Detalles del post</Text>

          <Input
            multiline={true}
            placeholder="Destaca tu visita con un comentario breve..."
            style={{ margin: 20 }}
            value={this.state.description}
            onChangeText={(description) =>
              this.onChangeDescription(description)
            }
          />
          <Button status="success" onPress={this.onSubmit}>
            Publicar
          </Button>
        </View>
      </ScrollView>
    );
  }
}

export default withFirebaseHOC(AddPost);
