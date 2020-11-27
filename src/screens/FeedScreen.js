//-- Developed by Carlos Delgado
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { FirebaseCollectionEnum } from '../constants/FirebaseCollections';

import firestore from '@react-native-firebase/firestore';

import PostComponent from '../components/PostComponent';

const postsRef = firestore().collection(FirebaseCollectionEnum.MFPost);


const FeedScreen = ({ selectedChallengePoint }) => {
    const [posts, setPosts] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchPosts = (id) => {
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

    useEffect(() => {
        fetchPosts(selectedChallengePoint.id);
    }, []);

    return (
        <ScrollView style={styles.scrollView}>
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
