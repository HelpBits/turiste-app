//-- Developed by Carlos Delgado
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from '@ui-kitten/components';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import Modal from 'react-native-modal';

import firestore from '@react-native-firebase/firestore';

import PostComponent from '../components/PostComponent';
import AddPostScreen from './AddPostScreen';

const postsRef = firestore().collection(FirebaseCollectionEnum.MFPost);

const FeedScreen = ({ selectedChallengePoint }) => {
  const [posts, setPosts] = useState(null);
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = postsRef
      .where('challengePointId', '==', selectedChallengePoint.id)
      .onSnapshot((snapshot) => {
        let postList = [];
        if (snapshot) {
          postList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        postList.sort((a, b) => {
          if (a.creationDate < b.creationDate) {
            return 1;
          }
          if (a.creationDate > b.creationDate) {
            return -1;
          }
          return 0;
        });

        setPosts(postList);
      });

    return unsubscribe;
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
        onError={(e) => console.log}
        source={{
          uri: selectedChallengePoint.photo
            ? selectedChallengePoint.photo
            : require('../../assets/no-image.jpg'),
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
