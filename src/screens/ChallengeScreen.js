import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const ChallengeScreen = () => {
  const [language, setLanguage] = useState('javaScript');

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 30}}>retos u.u</Text>
      <Picker
        selectedValue={language}
        style={styles.ChallengePickerState}
        onValueChange={(itemValue, itemIndex) => setLanguage(itemValue)}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  ChallengePickerState: {
    height: 50,
    width: 200,
  },
});

export default ChallengeScreen;
