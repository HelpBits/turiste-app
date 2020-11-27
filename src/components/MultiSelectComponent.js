import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Listo"
          submitButtonStyle={{ borderRadius: 5 }}
        />
      </View>
      <View>
        {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedTags)}
      </View>
      <TouchableOpacity
        onPress={() => setShowSelectTagsModal(false)}
        style={styles.closeButton}>
        <Text>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    padding: 30,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'space-between',
  },
  multiSelectStyle: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  closeButton: {
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderWidth: 0.3,
  },
});

export default MultiselectComponent;
