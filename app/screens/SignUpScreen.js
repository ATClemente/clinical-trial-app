import React from 'react';
import axios from 'axios';
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
    const btnStyle = [Styles.buttonGreen, 
      btnDisabled 
      ? Styles.disabled 
      : Styles.enabled ];
    return (      
      <View style={Styles.container}>
        <View style={Styles.form}>
          <TextInput
            style={Styles.textInput}
            placeholder="Username"
            onChangeText={username => this.setState({username})}
          />
          <TextInput
            style={Styles.textInput}
            placeholder="Password"
            onChangeText={password => this.setState({password})}
          />
          <TouchableOpacity 
            style={btnStyle} 
            onPress={this._signUpAsync}
            disabled={btnDisabled}>
            <Text style={Styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _signUpAsync = async () => {
    axios.post(
      Urls.server + '/auth/register',
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
        console.log(JSON.stringify(error.response));
        Alert.alert(error.response.data.status);
      }
      else {
        Alert.alert(JSON.stringify(error));
      }
    });

    //await AsyncStorage.setItem('userToken', 'abc');
    //this.props.navigation.navigate('Main');
  };
}
