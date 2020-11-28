import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../styles/theme';


const ChallengePointSummaryComponent = ({ selectChallengePoint }) => {
  return (
    <View>
      <View style={styles.summaryHeader}>
        <View>
          <Text style={styles.summaryHeaderTitle}>
            {selectChallengePoint.name}
          </Text>
          <Text>Has visitado este lugar 8 veces</Text>
        </View>
        <Icon
          style={styles.summaryHeaderButton}
          name="check-circle"
          size={35}
          color={colors.green}
        />
      </View>
      <Text style={styles.modalText}>{selectChallengePoint.desc}</Text>
      <Text>{faker.lorem.paragraphs(10)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryHeader: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: colors.red,
  },
  summaryHeaderTitle: {
    fontSize: 20,
  },
  summaryHeaderButton: {
    marginRight: 5,
  },
});

export default ChallengePointSummaryComponent;
