//-- Developed by Carlos Delgado
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';

import firestore from '@react-native-firebase/firestore';

import PostComponent from '../components/PostComponent';

const postsRef = firestore().collection(FirebaseCollectionEnum.MFPost);

const FeedScreen = ({ selectedChallengePointId }) => {
  const [posts, setPosts] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = (id) => {
    console.log('id', id);
    try {
      postsRef.where('challengePointId', '==', id).onSnapshot(
        async (snapshot) => {
          const postList = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setPosts(postList);
          setIsRefreshing(false);
          console.log(postList);
        },
        (error) => console.log(error),
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts(selectedChallengePointId);
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={[styles.title]}>Random Text</Text>
      <Text style={[styles.description]}>
        Descripcion de este lugar, multilinea, usualmente tiene mas texto que
        los demas campos.
      </Text>
      <Text style={[styles.description, { paddingBottom: 10 }]}>
        Has visitado este lugar n veces
      </Text>
      {posts && posts.map((post) => <PostComponent post={post} />)}
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
});

export default FeedScreen;
