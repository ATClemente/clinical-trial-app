import React from 'react';
import {
  Alert,
  AsyncStorage,
  Text,
  TextInput,
  View
} from 'react-native';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Urls from '../constants/Urls';
import GradientButton from '../components/GradientButton';
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
    return (      
      <View style={Styles.container}>
        <View style={Styles.form}>
          <TextInput
            style={Styles.formInput}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
          />
          <TextInput
            style={Styles.formInput}
            placeholder="Password"
            onChangeText={(password) => this.setState({password})}
          />
          <View style={{ marginVertical: 15 }}>
            <GradientButton
              colors={[Colors.blueOne, Colors.blueTwo]}
              handleClick={this._signInAsync}
              disabled={btnDisabled}
              loading={this.state.loading}
              text='Login'
            />
          </View>
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
