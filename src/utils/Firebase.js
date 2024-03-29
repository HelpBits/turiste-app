import firebase from '@react-native-firebase/app';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Firebase = {
  uploadPost: (post) => {
    const user = auth().currentUser;
    const uploadData = {
      challengePointId: post.challengePointId,
      creationDate: firebase.firestore.FieldValue.serverTimestamp(), //get timestamp
      likedByUsersId: [],
      logEditorId: user.uid,
      photo: { uri: post.photo },
      review: post.description,
    };
    return firebase
      .firestore()
      .collection(FirebaseCollectionEnum.MFPost)
      .add(uploadData);
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
  getCollection: (collectionName) => {
    return firestore().collection(collectionName);
  },
  getDocumentById: (collectionName, documentId) => {
    return firestore().collection(collectionName).doc(documentId);
  },
  getCollectionFilterBy: (collectionName, query) => {
    return firestore().collection(collectionName).where(query);
  },
};

export default Firebase;
