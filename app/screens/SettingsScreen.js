import React from 'react';
import { 
  ActivityIndicator,
  View, 
  Button, 
  AsyncStorage, 
  Text,
  TouchableOpacity,
  TextInput
 } from 'react-native';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      age: '',
      gender: '',
      cancerType: '',
      loading: false
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
    await this.setState({ loading: true });
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
            style={Styles.button} 
            onPress={this._updateProfileAsync}
          >
            <LinearGradient 
              style={Styles.button}
              colors={[Colors.radar2, Colors.radar3]}
              start={[0, 0.5]}
              end={[1, 0.5]}
            >
              { this.state.loading && <ActivityIndicator animating={true} color='#ffffff' /> }
              { !this.state.loading && <Text style={Styles.buttonText}>Update Profile</Text> }
            </LinearGradient>          
          </TouchableOpacity>
        </View>
        <Button title='Sign Out' onPress={this._signOutAsync} />
      </View>
    );
  }

}
