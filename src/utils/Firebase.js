import firebase from '@react-native-firebase/app'
import uuid from 'uuid'

const Firebase = {
    uploadPost: post => {
        const id = uuid.v4()
        const uploadData = {
            id: id,
            postPhoto: post.photo,
            postTitle: post.title,
            postDescription: post.description,
            likes: []
        }
        return firebase
            .firestore()
            .collection('MFPost')
            .doc(id)
            .set(uploadData)
    },
    getPosts: () => {
        return firebase
            .firestore()
            .collection('MFPost')
            .where("id", "==", "post2")
            .get()
            .then(function (querySnapshot) {
                let posts = querySnapshot.docs.map(doc => doc.data())
                // console.log(posts)
                return posts
            })
            .catch(function (error) {
                console.log('Error getting documents: ', error)
            })
    }
}

export default Firebase