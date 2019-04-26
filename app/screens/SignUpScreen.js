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
import { LinearGradient } from 'expo';
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
            style={Styles.textInput}
            placeholder="Username"
            onChangeText={username => this.setState({username: username.trim()})}
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
            <LinearGradient 
              style={Styles.button}
              colors={[Colors.radar2, Colors.radar3]}
              start={[0, 0.5]}
              end={[1, 0.5]}
            >
              { this.state.loading && <ActivityIndicator animating={true} color='#ffffff' /> }
              { !this.state.loading && <Text style={Styles.buttonText}>Sign Up</Text> }
            </LinearGradient>
          </TouchableOpacity>
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
