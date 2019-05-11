import React from 'reactn';
import { 
  Alert,
  AsyncStorage,
  Text,
  View,
 } from 'react-native';
import { Toast } from 'native-base';
import axios from 'axios';
import Urls from '../constants/Urls';
import GradientButton from '../components/GradientButton';
import FormInput from '../components/FormInput';
import FormDatePicker from '../components/FormDatePicker';
import FormSwitch from '../components/FormSwitch';
import Colors from '../constants/Colors';
import { toastDelay } from '../constants/Constants';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.global.profile.username,
      email: this.global.profile.email,
      dob: this.global.profile.dob,
      gender: this.global.profile.gender,
      location: this.global.profile.location,
      cancerType: this.global.profile.cancerType,
      isLoading: false,
    }
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _updateProfileAsync = async () => {
    await this.setState({ isLoading: true });
    try {
      const { data } = await axios.patch(
        Urls.server + '/user/profile',
        {
          email: this.state.email,
          dob: this.state.dob,
          gender: this.state.gender,
          location: this.state.location,
          cancerType: this.state.cancerType
        },
        {
          headers: {
            Authorization: this.global.token,
            'Content-Type': 'application/json'
          }
        }
      );
      this.setGlobal({ profile: data.profile });
      await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
      Object.keys(data.profile).forEach(item => {
        this.setState({ item });
      });
      Toast.show({
        text: data.status,
        buttonText: 'Okay',
        type: 'success',
        duration: toastDelay
      });
    } catch (e) {
      console.log(e);
      if (e.response) {
        Toast.show({
          text: 'Error updating profile',
          buttonText: 'Okay',
          type: 'warning',
          duration: toastDelay
        });      
      } else {
        Alert.alert(JSON.stringify(e));
      }
    } finally {
      this.setState({ isLoading: false });
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
          marginTop: 10
        }}>
          <View>
            <Text
              style={{ alignSelf: 'center', fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}
            >
              {this.state.username}
            </Text>
            <FormInput
              label='Email'
              placeholder='johndoe@example.com'
              keyboardType='email-address'
              autoCapitalize='none'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
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
              value={this.state.gender}
            />
            <FormInput
              label='Location (Zip Code)'
              placeholder='90210'
              keyboardType='number-pad'
              maxLength={5}
              value={this.state.location}
              defaultValue={this.global.profile.location}
              onChangeText={location => this.setState({ location })}
            />
            <FormInput
              label='Cancer Type'
              placeholder='Lung cancer'
              value={this.state.cancerType}
              onChangeText={cancerType => this.setState({ cancerType })}
            />
            <View style={{ marginTop: 8, marginBottom: 14 }}>
              <GradientButton
                colors={[Colors.radar2, Colors.radar3]}
                handleClick={ this._updateProfileAsync }
                loading={ this.state.isLoading }
                text='Update Profile'
              />
            </View>
            <Text
              style={{ alignSelf: 'center', fontSize: 16, color: '#1b6ae8' }}
              onPress={this._signOutAsync} 
            >
              Sign Out
            </Text>
          </View>
        </View>
      </View>
    )
  }
};
