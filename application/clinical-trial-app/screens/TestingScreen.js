import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
  Alert,
  TextInput,
  Picker,
  Layout
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import ClinicalTrialSearchResults from '../components/ClinicalTrialSearchResults'

export default class TestingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder',
            singleLineValue: "",
            secureTextValue: ""
    };
  }

  updateSingleLineValue = (value) => this.setState({ singleLineValue: value });
   updateSecureTextValue = (value) => this.setState({ secureTextValue: value });


  render() {
    return (
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="A single line text input"
          onChangeText={this.updateSingleLineValue}
          style={[{ marginBottom: 10 }, styles.textInputStyle]}
          value={this.state.singleLineValue}
        />

        <TextInput
          placeholder="A secure text field"
          keyboardAppearance="dark"
          value={this.state.secureTextValue}
          onChangeText={this.updateSecureTextValue}
          secureTextEntry
          style={styles.textInputStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
  textInputStyle : {
    width: 120,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 15,
    padding: 5,
    height: 40,
  }
});
