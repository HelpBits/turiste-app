import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const AnnotationContent = ({ coordinate, setSelectedPoint }) => {
  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => setSelectedPoint(coordinate)}>
      <Icon name="map-marker" color="red" />
      <Text style={styles.touchableText}>{coordinate.name}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  touchable: {
    width: 40,
    height: 30,
    alignItems: 'center',
  },
  touchableText: {
    color: 'black',
    backgroundColor: 'lightblue',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 5,
    padding: 1,
  },
});

export default AnnotationContent;
