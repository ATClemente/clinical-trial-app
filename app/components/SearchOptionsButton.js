import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const theme = {
  blue: {
    border: '#b9ccea',
    background: '#e8efff',
    icon: '#87a0c6',
    text: '#324e7a'
  },
  orange: {
    border: '#ead5b9',
    background: '#fff5e8',
    icon: '#c6aa87',
    text: '#7a5a32'
  }
}

export default ({ style, handleTouch, focused, text, icon }) => {
  return (
    <View style={style ? style : {}}>
      <TouchableOpacity
        style={{ 
          flex: 1, 
          borderWidth: 1, 
          borderColor: focused ? theme.orange.border : '#ccc', 
          backgroundColor: focused ? theme.orange.background : '#fff',
          borderRadius: 4, 
          height: 34 }}
        onPress={() => handleTouch(true)}
      >
        <View
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}
        >
        { focused && 
          <Ionicons 
          style={{ color: theme.orange.icon }}
          size={18}
          name={icon} />
        }
          <Text style={{
            marginLeft: 4, 
            fontSize: 14, 
            color: focused ? theme.orange.text : '#aaa'
          }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
