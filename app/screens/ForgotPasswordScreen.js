import React from 'react';
import {
  Keyboard,
  Text,
  View
} from 'react-native';
import { Toast } from 'native-base';
import FormInput from '../components/FormInput';
import GradientButton from '../components/GradientButton';
import Colors from '../constants/Colors';
import Urls from '../constants/Urls';
import { toastDelay } from '../constants/Constants';

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false
    }
  }

  static navigationOptions = {
    title: 'Forgot Password',
  };

  render() {
    return (      
      <View style={{ 
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <View style={{
          width: '100%',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
          <View style={{ paddingBottom: 15 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              Enter your email address to reset your password.
            </Text>
            <Text>
              If you have no email address saved in Settings, please create a new account.
            </Text>
          </View>
          <FormInput
            label='Email'
            placeholder='johndoe@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <View style={{ marginTop: 8, marginBottom: 14 }}>
            <GradientButton
              colors={[Colors.radar2, Colors.radar3]}
              handleClick={this._resetPassword}
              loading={this.state.isLoading}
              disabled={!this._isEmailValid()}
              text='Send Reset Password Link'
            />
          </View>
          <View style={{ height: '40%' }} />
        </View>
      </View>
    );
  }

  _resetPassword = async () => {
    Keyboard.dismiss();
    await this.setState({ loading: true });
    try {
      const { data } = await axios.get(
        Urls.server + '/auth/resetPassword?email=' + this.state.email
      );    } catch (e) {
      if (e.response) {
        Toast.show({
          text: e.response.data.status,
          buttonText: 'Okay',
          type: 'warning',
          duration: toastDelay
        });
      } else {
        Toast.show({
          text: e,
          buttonText: 'Okay',
          type: 'warning',
          duration: toastDelay
        });
      }
    }
    await this.setState({ loading: false });
  }

  _isEmailValid = () => {
    let email = this.state.email;
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(String(email).toLowerCase())
  }
}
