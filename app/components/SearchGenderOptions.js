import React from 'reactn';
import {
  Button,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import FormInput from './FormInput';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';

export default class SearchGenderOptions extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      gender: null,
      age: null,
      male: false,
      female: false,
    }
  }

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        avoidKeyboard={true}
        onRequestClose={() => this.props.setVisible(false)}
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
          <View style={{ width: '100%%' }}>
            <CheckBox
              title='Male'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.male}
              onPress={this._setMale}
            />
            <CheckBox
              title='Female'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.female}
              onPress={this._setFemale}
            />
            <Button onPress={() => {this.props.setGender(''); this.props.setVisible(false)}} title='Clear Filter' />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  _setMale = async () => {
    await this.setState({ male: true, female: false, gender: 'Male' });
    this._dismiss();
  }

  _setFemale = async () => {
    await this.setState({ female: true, male: false, gender: 'Female' }); 
    this._dismiss();
  }

  _reset = async () => {
    await this.setState({ male: false, female: false, gender:'' });
    this._dismiss();
  }

  _dismiss() {
    this.props.setGender(this.state.gender);
    setTimeout(() => {
      this.props.setVisible(false);
    }, 200);
  }
}
