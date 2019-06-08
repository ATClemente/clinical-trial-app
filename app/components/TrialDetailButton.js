import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default ({ style, disabled, handleTouch, type, icon, iconColor, iconSize }) => {
  const DEFAULT_ICON_SIZE = 24;
  return (
    <TouchableOpacity
      style={[{ padding: 10}, style]}
      disabled={disabled}
      onPress={handleTouch}
    >
      <View style={{ width: 24 }}>
      {
        disabled
        ? <ActivityIndicator size='small' color='#ccc' /> 
        : (<Entypo 
            style={{ color: iconColor }}
            size={ iconSize ? iconSize : DEFAULT_ICON_SIZE }
            name={icon}
          /> )
      }
      </View>
    </TouchableOpacity>
  );
};
