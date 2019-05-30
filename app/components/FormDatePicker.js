import React from 'react';
import { 
  View,
  StyleSheet,
  Text,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Colors from '../constants/Colors';

const FormDatePicker = ({label, errors, ...rest}) => {
  const inputStyles = {
    height: 40,
    borderColor: Colors.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 2,
    width: '100%'
  }

  return (
    <View style={{ marginVertical: 5}}>
      <Text style={{ marginBottom: 2, fontWeight: '500' }}>{label}</Text>
      <DatePicker
        style={inputStyles}
        format='MM/DD/YYYY'
        confirmBtnText='Select'
        cancelBtnText='Cancel'
        showIcon={false}
        customStyles={{
          dateInput: {
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderColor: Colors.SILVER,
            borderBottomWidth: StyleSheet.hairlineWidth,
          },
          placeholderText: {
            alignSelf: 'flex-start'
          },
          dateText: {
            alignSelf: 'flex-start'
          }
        }}
        {...rest}
      />
    </View>
  )
}

export default FormDatePicker;
