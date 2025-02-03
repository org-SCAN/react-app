import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

const SettingsFormField = (props) => {
  const { placeholder, keyboardType, maxLength, styles, value, onChangeText, onPress, buttonText, storedValue, storedText, noStoredText } = props;
  return (
    <View style={styles.fieldContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonTitle}>{buttonText}</Text>
      </TouchableOpacity>
      {storedValue ? (
        <Text style={styles.details}>{storedText} : {storedValue}</Text>
      ) : (
        <Text style={styles.details}>{noStoredText}</Text>
      )}
    </View>
  );
};

export default SettingsFormField;
