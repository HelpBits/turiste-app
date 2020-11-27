import React from 'react';
import {Image, TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-ui-kitten';

const PostComponent = ({post}) => {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: post.photo
            ? post.photo.postPhoto
            : 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pngall.com%2Fwp-content%2Fuploads%2F2016%2F05%2FNature-Free-Download-PNG-180x180.png&f=1&nofb=1',
        }}
        style={styles.cardImage}
      />
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
        <Text category="p2">{post.review}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'red',
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

export default PostComponent;
