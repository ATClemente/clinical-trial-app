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
import Colors from '../constants/Colors';
import ClinicalTrialSearchResults from '../components/ClinicalTrialSearchResults';

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
    const btnDisabled = !this.state.username || !this.state.password;
    const btnStyle = [styles.button, 
      btnDisabled 
      ? styles.disabled 
      : styles.enabled ];
    return (
      <View style={styles.container}>
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

        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            onChangeText={(password) => this.setState({password})}
          />
          <TouchableOpacity 
            style={btnStyle} 
            onPress={this._signInAsync}
            disabled={btnDisabled}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>



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
  },
  form: {
    justifyContent: 'center',
    width: '80%'
  },
  textInput: {
    height: 40,
    borderColor: Colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  enabled: {
    opacity: 1
  },
  disabled: {
    opacity: 0.5
  }
});
