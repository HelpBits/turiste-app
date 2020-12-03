//-- Developed by Carlos Delgado
import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Image} from 'react-native';
import {Text, Button, Input} from '@ui-kitten/components';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';
import Modal from 'react-native-modal';

import firestore from '@react-native-firebase/firestore';

import PostComponent from '../components/PostComponent';
import AddPostScreen from './AddPostScreen';

const postsRef = firestore().collection(FirebaseCollectionEnum.MFPost);

const FeedScreen = ({selectedChallengePoint}) => {
  const [posts, setPosts] = useState(null);
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);

  const fetchPosts = (id) => {
    try {
      postsRef
        .where('challengePointId', '==', id)
        .get()
        .then(function (querySnapshot) {
          setPosts(
            querySnapshot.docs.map((doc) => {
              return {id: doc.id, ...doc.data()};
            }),
          );
        });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts(selectedChallengePoint.id);
  }, [selectedChallengePoint]);

  return (
    <ScrollView style={styles.scrollView}>
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropColor="white"
        backdropOpacity={1}
        isVisible={newPostModalVisible}>
        <AddPostScreen
          setShowPostCreationModal={setNewPostModalVisible}
          challengePoint={selectedChallengePoint}
        />
      </Modal>
      <Image
        style={styles.container}
        source={{
          uri: selectedChallengePoint.photo,
        }}
      />
      <Button
        onPress={() => setNewPostModalVisible(true)}
        style={{
          alignItems: 'center',
          padding: 10,
          margin: 30,
        }}>
        Agrega un nuevo post al feed
      </Button>
      {posts &&
        posts.map((post) => <PostComponent key={post.id} post={post} />)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  description: {
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  container: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 60,
  },
});

export default FeedScreen;
