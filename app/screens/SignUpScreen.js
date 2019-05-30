import React from 'reactn';
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
import { toastDelay } from '../constants/Constants';

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      verifyPwd: '',
      location: '',
      gender: false,
      loading: false,
      errors: {}
    }
  }

  _timeOut = (verifyPwd) => {
    setTimeout(() => {
      this.setState({verifyPwd});
      if (this.state.password !== this.state.verifyPwd) {
        Alert.alert('passwords dont match');
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const btnDisabled = !this.state.username || !this.state.password || !this.state.verifyPwd || (this.state.password !== this.state.verifyPwd);
    const verifyPwdStyle = this.state.verifyPwd && this.state.password !== this.state.verifyPwd ? [Styles.formInput, Styles.error] : Styles.formInput;
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
            autoCapitalize='none'
            onChangeText={password => this.setState({password})}
          />
          <TextInput
            style={verifyPwdStyle}
            placeholder='Verify Password'
            secureTextEntry
            autoCapitalize='none'
            onChangeText={verifyPwd => this.setState({ verifyPwd })}
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
      this.setGlobal({ 
        token: data.jwt,
        profile: data.profile,
        trials: [],
      });
      this.props.navigation.navigate('Main');
    } catch (e) {
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
      this.setState({ loading: false });
    }
  };
}
