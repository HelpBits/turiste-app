import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Button,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';

const MultiselectComponent = ({
  tags,
  selectedTags,
  setSelectedTags,
  setShowSelectTagsModal,
}) => {
  return (
    <View style={styles.mainView}>
      <View style={styles.multiSelectStyle}>
        <MultiSelect
          hideTags
          items={tags}
          uniqueKey="id"
          ref={(component) => {
            multiSelect = component;
          }}
          onSelectedItemsChange={setSelectedTags}
          selectedItems={selectedTags}
          selectText="Seleccionar Etiquetas"
          searchInputPlaceholderText="Buscando..."
          onChangeInput={(text) => console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#000"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="red"
          displayKey="name"
          searchInputStyle={{color: '#CCC'}}
          submitButtonColor="#CCC"
          submitButtonText="Listo"
          submitButtonStyle={{borderRadius: 5}}
        />
      </View>

      <View>
        {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedTags)}
      </View>
      <Button title="Cerrar" onPress={() => setShowSelectTagsModal(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'lightgreen',
    minHeight: '30%',
    padding: 30,
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  multiSelectStyle: {
    // width: '75%',
    padding: 5,
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default MultiselectComponent;
