import React from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LinearGradient } from 'expo';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Urls from '../constants/Urls';
import axios from 'axios';

export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false
    }
  }

  render() {
    const btnDisabled = !this.state.username || !this.state.password;
    const btnStyle = [Styles.button,
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
            <LinearGradient 
              style={Styles.button}
              colors={[Colors.blueOne, Colors.blueTwo]}
              start={[0, 0.5]}
              end={[1, 0.5]}
            >
              { this.state.loading && <ActivityIndicator animating={true} color='#ffffff' /> }
              { !this.state.loading && <Text style={Styles.buttonText}>Login</Text> }
            </LinearGradient>
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
    await this.setState({ loading: true });
    try {
      const { data } = await axios.post(
        Urls.server + '/auth/login',
        {
          username: this.state.username,
          password: this.state.password
        }
      );
      await AsyncStorage.setItem('jwt', data.jwt);
      await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
      this.props.navigation.navigate('Main');
    } catch (e) {
      if (e.response) {
        Alert.alert(JSON.stringify(e.response.data.status));
      } else {
        Alert.alert(JSON.stringify(error));
      }
      this.setState({ loading: false });
    }
  };
}
