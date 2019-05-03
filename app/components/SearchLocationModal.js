import React from 'react';
import { 
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FormInput from './FormInput';
import FormSwitch from './FormSwitch';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';

export default class SearchLocationModal extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      gender: false,
      location: '',
      isLoading: false
    }
  }

  _updateProfileAsync = async () => {
    await this.setState({ isLoading: true });
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
      await AsyncStorage.setItem('jwt', data.jwt);
      await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
      Object.keys(data.profile).forEach(item => {
        this.setState({ item });
      });
      Toast.show({
        text: data.status,
        buttonText: 'Okay',
        type: 'success',
        duration: 3000
      });
    } catch (e) {
      console.log(e);
      if (e.response) {
        Toast.show({
          text: 'Error updating profile',
          buttonText: 'Okay',
          type: 'warning',
          duration: 3000
        });      
      } else {
        Alert.alert(JSON.stringify(e));
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return(
      <Modal
        visible={this.props.visible}
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
                onChangeText={location => this.setState({ location })}
              />
            <View style={{ marginTop: 15, marginBottom: 12 }}>
              <GradientButton
                colors={[Colors.radar2, Colors.radar3]}
                loading={ this.state.isLoading }
                handleClick={ this._updateProfileAsync }
                text='Update Profile'
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
}