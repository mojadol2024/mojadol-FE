import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ReplyButton = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.smallButton, disabled && styles.disabledButton]}
      disabled={disabled}
    >
      <Text style={styles.smallButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  smallButton: {
    backgroundColor: '#c78c30',
    borderWidth: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 22.375,
    borderColor: '#ddd',
    marginLeft: 5,
  },
  smallButtonText: {
    color: 'black',
    fontSize: 10,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
});

export default ReplyButton;
