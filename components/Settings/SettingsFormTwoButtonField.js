import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

const SettingsFormTwoButtonField = (props) => {
  const { placeholder, keyboardType, maxLength, value, styles, onChangeText, buttonTextLeft, buttonTextRight, onPressLeft, onPressRight, storedValue, storedText, noStoredText } = props;
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
      <View style={styles.twoButtonsContainer}>
        <TouchableOpacity onPress={onPressLeft} style={styles.twoButtonsLeft} >
            <Text style={styles.buttonTitle}>{buttonTextLeft}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressRight} style={styles.twoButtonsRight} >
            <Text style={styles.buttonTitle}>{buttonTextRight}</Text>
        </TouchableOpacity>
    </View>
      {storedValue ? (
        <Text style={styles.details}>{storedText} : {storedValue}</Text>
      ) : (
        <Text style={styles.details}>{noStoredText}</Text>
      )}
    </View>
  );
};

export default SettingsFormTwoButtonField;
