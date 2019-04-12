import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Alert
} from 'react-native';

 class ClinicalTrialAPI extends Component {

   static testFunc = () => {
    Alert.alert("Called code from the other file");
  }
}

//const ClincalTrialAPIUtility = new ClinicalTrialAPI();
//export default ClincalTrialAPIUtility;

export default ClinicalTrialAPI;