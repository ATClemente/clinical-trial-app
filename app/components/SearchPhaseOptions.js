import React from 'reactn';
import {
  Button,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements'
import Modal from 'react-native-modal';
import FormInput from './FormInput';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';

export default class SearchGenderOptions extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      phase: '',
      phase1: false,
      phase2: false,
      phase3: false,
      phase4: false,
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
            <Text style={{ alignSelf: 'center', fontSize: 20 }}>
              Set Phase
            </Text>
            <CheckBox
              title='Phase I'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.phase1}
              onPress={this._set1}
            />
            <CheckBox
              title='Phase II'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.phase2}
              onPress={this._set2}
            />
            <CheckBox
              title='Phase III'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.phase3}
              onPress={this._set3}
            />
            <CheckBox
              title='Phase VI'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.phase4}
              onPress={this._set4}
            />
            <Button onPress={this._reset} title='Clear Filter' />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  _reset = async () => {
    await this.setState({ phase1: false, phase2: false, phase3: false, phase4: false, phase: '' });
    this.props.setPhase(''); 
    this.props.setVisible(false);
    this._dismiss();
  }

  _set1 = async () => {
    await this.setState({ phase1: true, phase2: false, phase3: false, phase4: false, phase: 'I' });
    this._dismiss();
  }

  _set2 = async () => {
    await this.setState({ phase1: false, phase2: true, phase3: false, phase4: false, phase: 'II' });
    this._dismiss();
  }

  _set3 = async () => {
    await this.setState({ phase1: false, phase2: false, phase3: true, phase4: false, phase: 'III' });
    this._dismiss();
  }

  _set4 = async () => {
    await this.setState({ phase1: false, phase2: false, phase3: false, phase4: true, phase: 'IV' });
    this._dismiss();
  }

  _dismiss() {
    this.props.setPhase(this.state.phase);
    setTimeout(() => {
      this.props.setVisible(false);
    }, 200);
  }
}
