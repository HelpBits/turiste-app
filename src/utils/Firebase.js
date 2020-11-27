import firebase from '@react-native-firebase/app';
import uuid from 'react-native-uuid';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;

const Firebase = {
    uploadPost: (post) => {
        const id = uuid.v4();
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

export default Firebase;
