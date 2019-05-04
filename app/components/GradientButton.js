import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';

const GradientButton = ({ text, colors, handleClick, disabled, loading, padding }) => {
  const btnStyle = disabled ? styles.off: styles.on;
  const disableStatus = disabled ? disabled : false;
  const pad = padding ? padding : 12;
  return (
    <TouchableOpacity 
    style={btnStyle} 
    onPress={handleClick}
    disabled={disableStatus}>
    <LinearGradient 
      style={[styles.gradient, { paddingVertical: pad }]}
      colors={colors}
      start={[0, 0.5]}
      end={[1, 0.5]}
    >
      { loading && <ActivityIndicator animating={true} color='#ffffff' /> }
      { !loading && <Text style={styles.buttonText}>{text}</Text> }
    </LinearGradient>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    height: 20
  },
  on: {
    opacity: 1
  },
  off: {
    opacity: 0.5
  },
});

export default GradientButton;
