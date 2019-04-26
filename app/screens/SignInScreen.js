import React from 'react';
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../constants/Colors';
import Urls from '../constants/Urls';
import axios from 'axios';

export default class SignInScreen extends React.Component {
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
        <View style={styles.signupRow}>
            <Text
            onPress={() => {this.props.navigation.navigate('SignUp')}}>
              Sign Up
            </Text>
            <Text
            onPress={() => {this.props.navigation.navigate('ForgotPassword')}}>
              Forgot Password
            </Text>
          </View>
      </View>
    );
  }

  _signInAsync = async () => {
    axios.post(
      Urls.server + '/auth/login',
      {
        username: this.state.username,
        password: this.state.password
      }
    ).then(response => {
      AsyncStorage.setItem('jwt', response.data.jwt)
    }).then( () => {
      this.props.navigation.navigate('Main');
    }).catch(error => {
      if(error.response) {
        Alert.alert(error.response.data.status);
      }
      else {
        Alert.alert(JSON.stringify(error));
      }
    });
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
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: Colors.DODGER_BLUE,
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