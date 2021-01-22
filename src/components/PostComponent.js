import React, { useState, useEffect } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { Avatar } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';

const postRef = firestore().collection(FirebaseCollectionEnum.MFPost);
const usersRef = firestore().collection(FirebaseCollectionEnum.MFUser);

const PostComponent = ({ post }) => {
  const [likesNumber, setLikesNumber] = useState(0);
  const [creatorUsername, setCreatorUsername] = useState('');
  const [postModel, setPostModel] = useState(null);
  const [likedByMe, setLikedByMe] = useState(false);
  const [userModel, setUserModel] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;

    // get user data
    const unsubscribe = usersRef
      .where('mail', '==', user.email)
      .onSnapshot((snapshot) => {
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserModel(userData[0]);
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!post) {
      return;
    }

    usersRef
      .doc(post.logEditorId)
      .get()
      .then((user) => {
        if (!user.data()) {
          return;
        }

        setCreatorUsername(user.data().username);
      })
      .catch((error) =>
        console.error(
          'Error getting creator username from post',
          post.id,
          error,
        ),
      );

    const unsubscribe = postRef.doc(post.id).onSnapshot((snapshot) => {
      const postData = {
        id: snapshot.id,
        ...snapshot.data(),
      };

      setPostModel(postData);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userModel || !postModel) {
      return;
    }

    const myLikes = postModel.likedByUsersId.filter(
      (userId) => (userId = userModel.id),
    );

    setLikedByMe(myLikes.length > 0);
    setLikesNumber(postModel.likedByUsersId.length);
  }, [userModel, postModel]);

  const likePost = () => {
    try {
      if (likedByMe) {
        postRef.doc(post.id).update({
          likedByUsersId: firestore.FieldValue.arrayRemove(userModel.id),
        });

        Alert.alert('Se ha eliminado el like');
      } else {
        postRef.doc(post.id).update({
          likedByUsersId: firestore.FieldValue.arrayUnion(userModel.id),
        });

        Alert.alert('Se ha registrado el like');
      }
    } catch (error) {
      Alert.alert('No se ha podido registrar el like');
      console.error('Error updating user post likes', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity>
          <Avatar
            source={{
              uri:
                'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            }}
            size="small"
            style={styles.cardAvatar}
          />
        </TouchableOpacity>
        <Text> {creatorUsername} </Text>
      </View>
      <View style={styles.cardBody}>
        <Image source={{ uri: post.photo.uri }} style={styles.cardImage} />
        <View style={styles.cardActions}>
          <View style={styles.cardBottons}>
            <TouchableOpacity onPress={likePost}>
              {likedByMe ? (
                <Icon
                  style={styles.buttonIcon}
                  name="heart"
                  size={30}
                  color="red"
                />
              ) : (
                <Icon
                  style={styles.buttonIcon}
                  name="heart-o"
                  size={30}
                  color="red"
                />
              )}
            </TouchableOpacity>
          </View>
          <Text> {likesNumber} likes</Text>
        </View>
        <Text style={styles.reviewText}>{post.review}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 25,
    borderRadius: 5,
    padding: 5,
  },
  cardImage: {
    width: '100%',
    height: 300,
    marginBottom: 5,
  },
  cardHeader: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBody: {
    marginTop: 5,
    justifyContent: 'space-between',
  },
  cardActions: {
    height: 60,
    backgroundColor: 'white',
  },
  cardBottons: {
    flexDirection: 'row',
  },
  cardTitle: {
    color: 'white',
  },
  cardAvatar: {
    marginRight: 16,
  },
  cardContent: {
    padding: 10,
    borderWidth: 0.25,
    borderColor: 'white',
  },
  reviewText: {
    width: '100%',
    marginRight: 40,
  },
  buttonIcon: {
    marginLeft: 5,
    marginRight: 10,
  },
});

export default PostComponent;
