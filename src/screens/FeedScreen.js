//-- Developed by Carlos Delgado
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Image } from 'react-native';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';

import firestore from '@react-native-firebase/firestore';

import PostComponent from '../components/PostComponent';

const postsRef = firestore().collection(FirebaseCollectionEnum.MFPost);

const FeedScreen = ({ selectedChallengePoint }) => {
    const [posts, setPosts] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchPosts = (id) => {
        console.log('******* id', id);
        try {
            postsRef.where('challengePointId', '==', id).get()
                .then(function (querySnapshot) {
                    setPosts(querySnapshot.docs.map((doc) => { return { id: doc.id, ...doc.data() } }));
                })
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchPosts(selectedChallengePoint.id);
    }, [
        selectedChallengePoint
    ]);

    return (
        <ScrollView style={styles.scrollView}>
            <Image style={styles.container}
                source={{
                    uri: selectedChallengePoint.photo,
                }}
            />
            {posts && posts.map((post) => <PostComponent key={post.id} post={post} />)}
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
    },
    scrollView: {
        marginBottom: 60,
    }
});

export default FeedScreen;
