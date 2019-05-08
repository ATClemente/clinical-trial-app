import React from 'reactn';
import { 
  Alert,
  AsyncStorage,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
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
      gender: this.global.profile.gender,
      location: this.global.profile.location,
      isLoading: true,
      isSubmitting: false,
    }
  }

  _updateProfileAsync = async () => {
    await this.setState({ isSubmitting: true });
    try {
      const { data } = await axios.put(
        Urls.server + '/user/profile',
        {
          gender: this.state.gender,
          location: this.state.location,
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
    console.log(this.context);
    return(
      <Modal
        isVisible={this.props.visible}
        avoidKeyboard={true}
        onRequestClose={() => this.props.setLocationModal(false)}
      >
        <SafeAreaView style={{ 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#fff',
          borderRadius: 4,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}>
          <View>
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