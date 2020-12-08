import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {colors} from '../styles/theme';

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
            this.multiSelect = component;
          }}
          onSelectedItemsChange={setSelectedTags}
          selectedItems={selectedTags}
          selectText="Seleccionar Etiquetas"
          searchInputPlaceholderText="Buscando..."
          onChangeInput={(text) => console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor={colors.grey}
          tagBorderColor={colors.grey}
          tagTextColor={colors.black}
          selectedItemTextColor={colors.grey}
          selectedItemIconColor={colors.grey}
          itemTextColor="red"
          displayKey="name"
          searchInputStyle={{color: colors.grey}}
          submitButtonColor={colors.grey}
          submitButtonText="Listo"
          submitButtonStyle={{borderRadius: 5}}
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
