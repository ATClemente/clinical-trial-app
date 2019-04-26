import React from 'react';
import { 
  View, 
  Button, 
  AsyncStorage, 
  Text,
  TouchableOpacity,
  TextInput
 } from 'react-native';
import Styles from '../constants/Styles';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      age: '',
      gender: '',
      cancerType: ''
    };
    this._getProfileAsync();
  }

  static navigationOptions = {
    title: 'Settings',
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _getProfileAsync = async () => {
    const profile = await AsyncStorage.getItem('profile');
    await this.setState({ username: JSON.parse(profile).username });
  };

  _updateProfileAsync = async () => {
    console.log(JSON.stringify({
      username: this.state.username,
      email: this.state.email,
      age: this.state.age,
      gender: this.state.gender,
      cancerType: this.state.cancerType
    }));
  };

  render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.form}>
          <Text
            style={{ alignSelf: 'center', fontSize: 20, marginBottom: 10 }}
          >
            {this.state.username}
          </Text>
          <TextInput
            style={Styles.textInput}
            placeholder='Email'
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            style={Styles.textInput}
            placeholder='Gender'
            onChangeText={(gender) => this.setState({ gender })}
          />
          <TextInput
            style={Styles.textInput}
            placeholder='Age'
            keyboardType='numeric'
            onChangeText={(age) => this.setState({ age })}
          />
          <TextInput
            style={Styles.textInput}
            placeholder='Cancer Type'
            onChangeText={(cancerType) => this.setState({ cancerType })}
          />
          <TouchableOpacity 
            style={Styles.buttonBlue} 
            onPress={this._updateProfileAsync}
          >
            <Text style={Styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
        <Button title='Sign Out' onPress={this._signOutAsync} />
      </View>
    );
  }

}
