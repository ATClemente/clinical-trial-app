import React from 'react';
import axios from 'axios';
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
            style={Styles.formInput}
            placeholder="Username"
            onChangeText={username => this.setState({username: username.trim()})}
          />
          <TextInput
            style={Styles.formInput}
            placeholder="Password"
            onChangeText={password => this.setState({password})}
          />
          <View style={{ marginVertical: 15 }}>
            <GradientButton
              colors={[Colors.radar2, Colors.radar3]}
              handleClick={this._signUpAsync}
              disabled={btnDisabled}
              loading={this.state.loading}
              text='Sign Up'
            />
          </View>
        </View>
      </View>
    );
  }

  _signUpAsync = async () => {
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
        Alert.alert(JSON.stringify(e.response.data.status));
      } else {
        Alert.alert(JSON.stringify(error));
      }
      this.setState({ loading: false });
    }
  };
}
