import React from 'react';
import { 
  Alert,
  AsyncStorage,
  Button, 
  ScrollView,
  Text,
  View,
 } from 'react-native';
import GradientButton from '../components/GradientButton';
import FormInput from '../components/FormInput';
import FormDatePicker from '../components/FormDatePicker';
import FormSwitch from '../components/FormSwitch';
import Colors from '../constants/Colors';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      dob: '',
      gender: true,
      location: '',
      cancerType: '',
      isLoading: false,
    }
    this._getProfileAsync();
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _getProfileAsync = async () => {
    const profile = await AsyncStorage.getItem('profile');
    await this.setState({ username: JSON.parse(profile).username });
  };

  _updateProfileAsync = async () => {
    await this.setState({ isLoading: true });
    try {
      const { data } = await axios.post(
        Urls.server + '/user/profile',
        {
          email: this.state.email,
          dob: this.state.dob,
          gender: this.state.gender,
          location: this.state.location,
          cancerType: this.state.cancerType
        }
      );
      await AsyncStorage.setItem('jwt', data.jwt);
      await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
      console.log(data.profile);
      Object.keys(data.profile).forEach(item => {
        this.setState({ item });
      })
    } catch (e) {
      if (e.response) {
        Alert.alert(JSON.stringify(e.response.data.status));
      } else {
        Alert.alert(JSON.stringify(error));
      }
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <View style={{ 
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <View style={{
          width: '100%',
          justifyContent: 'center',
          paddingHorizontal: 20,
          marginTop: 20
        }}>
        <ScrollView>
          <Text
            style={{ alignSelf: 'center', fontSize: 20, marginBottom: 15, fontWeight: 'bold' }}
          >
            {this.state.username}
          </Text>
          <FormInput
            label='Email'
            placeholder='johndoe@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            value={ this.state.email }
            onChange={email => this.setState({ email })}
          />
          <FormDatePicker
            label='Date of Birth'
            placeholder='04/01/2019'
            onDateChange={dob => this.setState({ dob })}
            date={this.state.dob}
          />
          <FormSwitch
            label='Gender'
            onValueChange={gender => this.setState({ gender })}
            value={ this.state.gender }
          />
          <FormInput
            label='Location (Zip Code)'
            placeholder='90210'
            keyboardType='number-pad'
            maxLength={5}
            value={ this.state.location }
            onChange={location => this.setState({ location })}
          />
          <FormInput
            label='Cancer Type'
            placeholder="Lung cancer"
            value = { this.state.cancerType }
            onChange={cancerType => this.setState({ cancerType })}
          />
          <View style={{ marginTop: 20, marginBottom: 12 }}>
            <GradientButton
              colors={[Colors.radar2, Colors.radar3]}
              handleClick={ this._updateProfileAsync }
              loading={ this.state.isLoading }
              text='Update Profile'
            />
          </View>
          <Button title='Sign Out' onPress={this._signOutAsync} />
          </ScrollView>
        </View>
      </View>
    )
  }
};
