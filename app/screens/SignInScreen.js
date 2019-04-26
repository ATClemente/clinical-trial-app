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
import Styles from '../constants/Styles';
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
    const btnStyle = [Styles.buttonBlue,
      btnDisabled 
      ? Styles.disabled 
      : Styles.enabled ];
    return (      
      <View style={Styles.container}>
        <View style={Styles.form}>
          <TextInput
            style={Styles.textInput}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
          />
          <TextInput
            style={Styles.textInput}
            placeholder="Password"
            onChangeText={(password) => this.setState({password})}
          />
          <TouchableOpacity 
            style={btnStyle} 
            onPress={this._signInAsync}
            disabled={btnDisabled}>
            <Text style={Styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.signupRow}>
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
      return AsyncStorage.setItem('jwt', response.data.jwt)
      .then( () => {
        AsyncStorage.setItem('profile', JSON.stringify(response.data.profile));
      })
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
