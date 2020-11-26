import firebase from '@react-native-firebase/app'
import uuid from 'react-native-uuid';
import {FirebaseCollectionEnum} from '../constants/FirebaseCollections';


const Firebase = {
  uploadPost: (post) => {
    const id = uuid.v4();
    const uploadData = {
      id: id,
      postPhoto: post.photo,
      postTitle: post.title,
      postDescription: post.description,
      likes: [],
    };
    return firebase
      .firestore()
      .collection(FirebaseCollectionEnum.MFPost)
      .doc(id)
      .set(uploadData);
  },
  getPosts: (id) => {
    return firebase
      .firestore()
      .collection('MFPost')
      .where('challengePointId', '==', id)
      .get()
      .then(function (querySnapshot) {
        let posts = querySnapshot.docs.map((doc) => doc.data());
        return posts;
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  },
};

export default Firebase