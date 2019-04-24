import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../constants/Colors';

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    const btnDisabled = !this.state.username || !this.state.password;
    const btnStyle = [styles.button, 
      btnDisabled 
      ? styles.disabled 
      : styles.enabled ];
    return (      
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            onChangeText={username => this.setState({username})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            onChangeText={password => this.setState({password})}
          />
          <TouchableOpacity 
            style={btnStyle} 
            onPress={this._signUpAsync}
            disabled={btnDisabled}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _signUpAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('Main');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center'
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
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 5
  },
  enabled: {
    opacity: 1
  },
  disabled: {
    opacity: 0.5
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    height: 20
  }
});