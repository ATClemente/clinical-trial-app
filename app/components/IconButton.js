import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default ({ style, icon, iconSize, side, disabled, handleTouch, text, textColor, iconColor }) => {

  if (side === 'left') {
    return (
      <TouchableOpacity
        style={style}
        disabled={disabled}
        onPress={handleTouch}
      >
        <View style={{ 
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start' 
        }}>
          <Ionicons 
            style={{ marginRight: 6, color: disabled ? 'grey' : iconColor }}
            size={ iconSize ? iconSize : 24 }
            name={icon} />
          <Text style={{ color: disabled ? 'grey' : textColor }}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  } else if (side === 'right') {
    return (
      <TouchableOpacity
        style={style}
        disabled={disabled}
        onPress={handleTouch}
      >
        <View style={{ 
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start' 
        }}>
          <Text style={{ color: disabled ? 'grey' : textColor }}>{text}</Text>
          <Ionicons 
            style={{ marginLeft: 6, color: disabled ? 'grey' : iconColor }}
            size={ iconSize ? iconSize : 24 }
            name={icon} />
        </View>
      </TouchableOpacity>
    )
  }
}
