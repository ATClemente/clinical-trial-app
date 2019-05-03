import React from 'react';
import { 
  Text,
  TextInput,
  View,
} from 'react-native';
import Styles from '../constants/Styles';

const FormInput = ({label, errors, ...rest}) => {
  const inputStyle = errors ? [Styles.formInput, { borderBottomColor: 'red' }] : Styles.formInput;
  return (
    <View style={{ marginVertical: 5}}>
      <Text style={{ marginBottom: 2, fontWeight: 'bold' }}>{label}</Text>
      <TextInput
        style={inputStyle}
        {...rest}
      />
    </View>
  )
}

export default FormInput;
