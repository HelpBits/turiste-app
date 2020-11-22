import firestore from '@react-native-firebase/firestore';

const getCollection = (collectionName) => {
  return firestore().collection(collectionName);
};

export default getCollection;
