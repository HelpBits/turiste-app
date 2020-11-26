//-- Developed by Carlos Delgado
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {List} from 'react-native-ui-kitten';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';

import firestore from '@react-native-firebase/firestore';

import PostComponent from '../components/PostComponent';

const postsRef = firestore().collection(FirebaseCollectionEnum.MFPost);
const FeedScreen = ({selectedChallengePointId}) => {
  const [posts, setPosts] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async (id) => {
    try {
      postsRef.where('challengePointId', '==', id).onSnapshot(
        async (snapshot) => {
          const postList = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));

          setPosts(postList);
          setIsRefreshing(false);
        },
        (error) => console.log(error),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = () => {
    this.setState({isRefreshing: true});
    this.fetchPosts();
  };

  const renderItem = ({item}) => <PostComponent post={item} />;

  useEffect(() => {
    fetchPosts(selectedChallengePointId);
  }, []);

  return posts ? (
    <ScrollView style={styles.scrollView}>
      <Text style={[styles.title]}>Random Text</Text>
      <Text style={[styles.description]}>
        Descripcion de este lugar, multilinea, usualmente tiene mas texto que
        los demas campos.
      </Text>
      <Text style={[styles.description, {paddingBottom: 10}]}>
        Has visitado este lugar n veces
      </Text>
      <List
        style={styles.container}
        data={posts}
        renderItem={renderItem}
        keyExtractor={posts.id}
        refreshing={isRefreshing}
        onRefresh={() => onRefresh()}
      />
    </ScrollView>
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  card: {
    backgroundColor: 'white',
    marginBottom: 25,
  },
  cardImage: {
    width: '100%',
    height: 300,
  },
  cardHeader: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default FeedScreen;
