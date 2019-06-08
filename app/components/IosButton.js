import React from 'react';
import {
  Text,
  TouchableOpacity
} from 'react-native';

export default ({ handleTouch, title }) => {
  return (
    <TouchableOpacity 
      style={{ padding: 8 }} 
      onPress={handleTouch}
    >
      <Text style={{ color: '#0078ff', fontSize: 16, alignSelf: 'center' }}>{title}</Text>
    </TouchableOpacity>
  );
}