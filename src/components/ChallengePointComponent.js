import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FeedScreen from '../screens/FeedScreen';

const ChallengePointComponent = ({selectedPoint}) => {
  const [arrivesNumber, setArrivesNumber] = useState(0);
  const modalizeRef = useRef(null);

  const handleClosed = () => {
    console.log('closed');
  };

  const handleOpen = () => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  };

  const HeaderComponent = () => {
    return (
      <View style={styles.summaryHeader}>
        <View>
          <Text style={styles.summaryHeaderTitle}>{selectedPoint.name}</Text>
          {arrivesNumber <= 0 ? (
            <Text>Aún no lo has visitado</Text>
          ) : (
            <Text>Has visitado este lugar {arrivesNumber} veces</Text>
          )}
        </View>

        {arrivesNumber <= 0 ? (
          <Icon
            style={styles.summaryHeaderButton}
            name="checkbox-blank-circle-outline"
            size={40}
            color="red"
          />
        ) : (
          <Icon
            style={styles.summaryHeaderButton}
            name="check-circle-outline"
            size={40}
            color="green"
          />
        )}
      </View>
    );
  };

  useEffect(() => {
    handleOpen();
  }, []);

  return (
    <Modalize
      ref={modalizeRef}
      onClosed={handleClosed}
      alwaysOpen={200}
      modalStyle={{marginTop: '10%'}}
      onOpen={() => console.log('OPEN')}
      onOpened={() => console.log('OPENED')}
      onPositionChange={(value) => console.log('position change', value)}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
      }}>
      <HeaderComponent />
      <FeedScreen selectedChallengePointId={selectedPoint.id} />
    </Modalize>
  );
};

const styles = StyleSheet.create({
  summaryHeader: {
    flexDirection: 'row',
    flex: 1,
    height: 200,
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    backgroundColor: 'green',
  },
  summaryHeaderTitle: {
    fontSize: 20,
  },
  summaryHeaderButton: {
    alignSelf: 'baseline',
  },
});

export default ChallengePointComponent;
