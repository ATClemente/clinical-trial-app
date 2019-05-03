import React from 'react';
import {
  Alert,
  AsyncStorage,
  Keyboard,
  Text,
  TextInput,
  View
} from 'react-native';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Urls from '../constants/Urls';
import GradientButton from '../components/GradientButton';
import axios from 'axios';
import { Toast, Container } from 'native-base';

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
      <Container style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: '85%'
        }}>
          <TextInput
            style={Styles.formInput}
            placeholder='Username'
            autoCapitalize='none'
            onChangeText={(username) => this.setState({username})}
          />
          <TextInput
            style={Styles.formInput}
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            onChangeText={(password) => this.setState({password})}
          />
          <View style={{ marginTop: 15, marginBottom: 20 }}>
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
        <View style={{height: '10%'}}></View>
      </Container>
    );
  }

  _signInAsync = async () => {
    await this.setState({ loading: true });
    Keyboard.dismiss();
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
        Toast.show({
          text: e.response.data.status,
          buttonText: 'Okay',
          type: 'warning',
          duration: 3000
        });
      } else {
        Toast.show({
          text: e,
          buttonText: 'Okay',
          type: 'danger',
          duration: 3000
        });      }
      this.setState({ loading: false });
    }
  };
}
