
// import React, {useState, useRef, useEffect} from 'react';// import {StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';
// import {Modalize} from 'react-native-modalize';
// import faker from 'faker';
import React, { useRef, useState, useEffect } from 'react';

import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import faker from 'faker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import auth from '@react-native-firebase/auth';

import FeedScreen from '../screens/FeedScreen';

const user = auth().currentUser;

const ChallengePointComponent = ({selectedChallengePoint}) => {
  const [openModal, setUsername] = useState('');
  const [email, setEmail] = useState('');
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

  const getTotalArrives = () => {
    if(!selectedChallengePoint.checkins) return;

    setArrivesNumber(
      selectedChallengePoint
        .checkins
        .filter(checkin => {
          checkin.userId === user.uid;
        }).length
    );
  };

  /*
    renderContent = () => [

      <View style={s.content__header} key="0">
        <Text style={s.content__heading}>{selectedChallengePoint.name}</Text>
        <Text style={s.content__subheading}>
          `Has visitado este lugar ${getTotalArrives()}`
        </Text>
      </View>,

      <View style={s.content__inside} key="1">
        <Text style={s.content__paragraph}>{faker.lorem.paragraphs(4)}</Text>
        <Text style={[s.content__subheading, {marginTop: 30}]}>
          Horizontal ScrollView
        </Text>

        <ScrollView style={s.content__scrollview} horizontal>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <View key={i} style={s.content__block} />
            ))}
        </ScrollView>

        <Text style={s.content__paragraph}>{faker.lorem.paragraphs(5)}</Text>

        <TextInput
          style={s.content__input}
          placeholder="Type your username"
          clearButtonMode="while-editing"
        />
      </View>,
    ];
  */
 
  const renderHeader = () => (
    <>
      <View style={styles.summaryHeader}>
        <View>
          <Text style={styles.summaryHeaderTitle}>
            {selectedChallengePoint.name}
          </Text>
          {arrivesNumber <= 0 ?
            <Text>Aún no lo has visitado</Text> :
            <Text>Has visitado este lugar {arrivesNumber} veces</Text>}
        </View>


        {arrivesNumber <= 0 ?
          <Icon
            style={styles.summaryHeaderButton}
            name="checkbox-blank-circle-outline"
            size={40}
            color="red"
          /> :
          <Icon
            style={styles.summaryHeaderButton}
            name="check-circle-outline"
            size={40}
            color="green"
          />}

      </View>
    </>
  );

  const renderContent = () => (
    <FeedScreen selectedChallengePointId={selectedChallengePoint.id} />
  );

  useEffect(() => {
    handleOpen();
  }, []);

  return (
    <Modalize
      ref={modalizeRef}
      onClosed={handleClosed}
      alwaysOpen={200}
      onOpen={() => console.log('OPEN')}
      onOpened={() => console.log('OPENED')}
      onPositionChange={(value) => console.log('position change', value)}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
      }}>
      {renderContent()}
    </Modalize>
  );
};

const s = StyleSheet.create({
  content__header: {
    padding: 15,
    paddingBottom: 0,

    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  content__heading: {
    marginBottom: 2,

    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },

  content__subheading: {
    marginBottom: 20,

    fontSize: 16,
    color: '#ccc',
  },

  content__inside: {
    padding: 15,
  },

  content__paragraph: {
    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__scrollview: {
    marginVertical: 20,
  },

  content__block: {
    width: 200,
    height: 80,

    marginRight: 20,

    backgroundColor: '#ccc',
  },

  content__input: {
    paddingVertical: 15,
    marginBottom: 10,

    width: '100%',

    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },
});

export default ChallengePointComponent;

/*
      {selectedPoint && (
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => {
            console.log('abriendo');
            setModalVisible(true);
          }}>
          <View>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summaryHeaderTitle}>
                  {selectedPoint.name}
                </Text>
                <Text>Has visitado este lugar 8 veces</Text>
              </View>
              <Icon
                style={styles.summaryHeaderButton}
                name="check-circle"
                size={35}
                color="green"
              />
            </View>
            <Text style={styles.modalText}>{selectedPoint.desc}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setSelectedPoint(null)}
            style={styles.closePointInfo}>
            <Icon name="arrow-down" size={35} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
      )} */
