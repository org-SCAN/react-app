import React from 'react';
import { View, TextInput, Text } from 'react-native';

const SettingsFormFreeField = (props) => {
  const { placeholder, keyboardType, maxLength, styles, value, onChangeText, onBlur, title } = props;
  return (
    <View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.freeFieldContainer}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={styles.placeholder.color}
                keyboardType={keyboardType}
                maxLength={maxLength}
                style={styles.freeInput}
                value={value}
                multiline={true}
                scrollEnabled={false}
                onChangeText={onChangeText}
                onBlur={onBlur}
            />
        </View>
    </View>
  );
};

export default SettingsFormFreeField;
