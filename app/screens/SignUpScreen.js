import React from 'react';
import axios from 'axios';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Container, Toast } from 'native-base';
import GradientButton from '../components/GradientButton';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import Urls from '../constants/Urls';

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      verifyPwd: '',
      loading: false
    }
  }

  render() {
    const btnDisabled = !this.state.username || !this.state.password || !this.state.verifyPwd;
    const btnStyle = [Styles.button, 
      btnDisabled 
      ? Styles.disabled 
      : Styles.enabled ];
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
            onChangeText={username => this.setState({username: username.trim()})}
          />
          <TextInput
            style={Styles.formInput}
            placeholder='Password'
            secureTextEntry
            onChangeText={password => this.setState({password})}
          />
          <TextInput
            style={Styles.formInput}
            placeholder='Verify Password'
            secureTextEntry
            onChangeText={verifyPwd => this.setState({verifyPwd})}
          />
          <View style={{ marginTop: 15, marginBottom: 20 }}>
            <GradientButton
              colors={[Colors.radar2, Colors.radar3]}
              handleClick={this._signUpAsync}
              disabled={btnDisabled}
              loading={this.state.loading}
              text='Sign Up'
            />
          </View>
        </View>
        <View style={{height: '20%'}}></View>
      </Container>
    );
  }

  _signUpAsync = async () => {
    Keyboard.dismiss();
    if (this.state.password !== this.state.verifyPwd) {
      Toast.show({
        text: "Passwords don't match",
        buttonText: 'Okay',
        type: 'warning',
        duration: 3000
      });
      return;
    }
    await this.setState({ loading: true });
    try {
      const { data } = await axios.post(
        Urls.server + '/auth/register',
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
          type: 'warning',
          duration: 3000
        });
      }
      this.setState({ loading: false });
    }
  };
}
