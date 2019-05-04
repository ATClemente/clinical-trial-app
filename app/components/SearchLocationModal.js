import React from 'react';
import { 
  Alert,
  AsyncStorage,
  Modal,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormInput from './FormInput';
import FormSwitch from './FormSwitch';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';
import axios from 'axios';
import Urls from '../constants/Urls';

export default class SearchLocationModal extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      gender: false,
      location: '',
      isLoading: true,
      isSubmitting: false,
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('profile')
    .then(res => JSON.parse(res))
    .then(profile => {
      this.setState( { gender: profile.gender, location: profile.location })
      this.setState({ isLoading: false });
    });
  }

  _updateProfileAsync = async () => {
    await this.setState({ isSubmitting: true });
    const token = await AsyncStorage.getItem('jwt');
    // console.log(token);
    try {
      const { data } = await axios.put(
        Urls.server + '/user/profile',
        {
          gender: this.state.gender,
          location: this.state.location,
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(data);
      await AsyncStorage.setItem('jwt', data.jwt);
      await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
      Object.keys(data.profile).forEach(item => {
        this.setState({ item });
      });
      this.props.setProfileLocation(data.profile.location);
      this.props.setLocationModal(false);
    } catch (e) {
      console.log(e);
      if (e.response) {
        Alert.alert(e.response.data.status);  
      } else {
        Alert.alert(JSON.stringify(e));
      }
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    return(
      <Modal
        visible={this.props.visible}
        onRequestClose={() => this.props.setLocationModal(false)}
      >
        <SafeAreaView style={{ 
          flex:1, 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
        }}>
          <View style={{ width: '85%' }}>
            <View style={{
              paddingBottom: 15,
              marginBottom: 20, 
              borderColor: Colors.SILVER,
              borderBottomWidth: StyleSheet.hairlineWidth,              
            }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 15 }}>
                Please enter your location and gender
              </Text>
              <Text>
                We need this information to filter your search results.
              </Text>
            </View>
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
                onChangeText={location => {
                  this.setState({ location });
                  if(location.length == 5) {
                    Keyboard.dismiss();
                  }
                }}
              />
            <View style={{ marginTop: 15, marginBottom: 20 }}>
              <GradientButton
                colors={[Colors.radar2, Colors.radar3]}
                loading={ this.state.isSubmitting }
                handleClick={ this._updateProfileAsync }
                disabled={ !this.state.location }
                text='Update Profile'
              />
            </View>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <Text 
              style={{ fontSize: 18, color: '#1b6ae8' }}
              onPress={() => this.props.setLocationModal(false)}
            >
              Close
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
}