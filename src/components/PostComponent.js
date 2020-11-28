import React from 'react';
import {Image, TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-ui-kitten';

const PostComponent = ({post}) => {
  return (
    <View style={styles.card}>
      <Image source={{uri: post.photo.uri}} style={styles.cardImage} />
      <View style={styles.cardHeader}>
        <TouchableOpacity>
          <Avatar
            source={{
              uri:
                'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            }}
            size="small"
            style={styles.cardAvatar}
          />
        </TouchableOpacity>
        <Text style={styles.reviewText}>{post.review}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 25,
  },
  cardImage: {
    width: '100%',
    height: 300,
    marginTop: 20,
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
  reviewText: {
    marginRight: 40,
  },
});

export default PostComponent;
