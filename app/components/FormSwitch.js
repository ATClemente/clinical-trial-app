import React from 'react';
import { 
  Text,
  Switch,
  View,
} from 'react-native';
import Styles from '../constants/Styles';

const FormSwitch = ({label, errors, ...rest}) => {
  return (
    <View style={{ marginVertical: 5}}>
      <Text style={{ marginBottom: 2 }}>{label}</Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        marginBottom: 3
      }}>
        <Text style={{ marginRight: 10 }}>Female</Text>
        <Switch
          {...rest}
        />
        <Text style={{ marginLeft: 10 }}>Male</Text>
      </View>
    </View>
  )
}

export default FormSwitch;
