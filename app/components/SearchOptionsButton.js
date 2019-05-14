import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default ({ style, handleTouch, focused, text, icon }) => {
  return (
    <View style={style ? style : {}}>
      <TouchableOpacity
        style={{ 
          flex: 1, 
          borderWidth: 1, 
          borderColor: focused ? '#b9ccea' : '#ccc', 
          backgroundColor: focused ? '#e8efff' : '#fff',
          borderRadius: 4, 
          height: 34 }}
        onPress={() => handleTouch(true)}
      >
        <View
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}
        >
        { focused && 
          <Ionicons 
          style={{ color: '#87a0c6' }}
          size={18}
          name={icon} />
        }
          <Text style={{
            marginLeft: 4, 
            fontSize: 14, 
            color: focused ? '#324e7a' : '#aaa'
          }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
