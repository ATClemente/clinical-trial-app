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
          <View style={{ width: '100%' }}>
            <Text style={{ alignSelf: 'center', fontSize: 20 }}>
              Set Phase
            </Text>
            <CheckBox
              title='Phase I'
              iconType='ionicon'
              checkedIcon='ios-checkbox-outline'
              uncheckedIcon='ios-square-outline'
              checked={this.state.phase1}
              onPress={() => this.setState({ phase1: !this.state.phase1 })}
            />
            <CheckBox
              title='Phase II'
              iconType='ionicon'
              checkedIcon='ios-checkbox-outline'
              uncheckedIcon='ios-square-outline'
              checked={this.state.phase2}
              onPress={() => this.setState({ phase2: !this.state.phase2 })}
            />
            <CheckBox
              title='Phase III'
              iconType='ionicon'
              checkedIcon='ios-checkbox-outline'
              uncheckedIcon='ios-square-outline'
              checked={this.state.phase3}
              onPress={() => this.setState({ phase3: !this.state.phase3 })}
            />
            <CheckBox
              title='Phase IV'
              iconType='ionicon'
              checkedIcon='ios-checkbox-outline'
              uncheckedIcon='ios-square-outline'
              checked={this.state.phase4}
              onPress={() => this.setState({ phase4: !this.state.phase4 })}
            />
            <View style={{ marginTop: 20, marginBottom: 15 }}>
              <GradientButton
                colors={[Colors.radar2, Colors.radar3]}
                handleClick={this._setPhase}
                disabled={this.state.phase1 || this.state.phase2 || this.state.phase3 || this.state.phase4 ? false : true}
                text='Update'
              />
            </View>
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

  _setPhase = async () => {
    const phases = [];
    if (this.state.phase1) {
      phases.push('I');
    }
    if (this.state.phase2) {
      phases.push('II');
    }
    if (this.state.phase3) {
      phases.push('III');
    }
    if (this.state.phase4) {
      phases.push('IV');
    }
    await this.setState({ phase: phases.join() });
    this._dismiss();
  }

  _dismiss() {
    this.props.setPhase(this.state.phase);
    setTimeout(() => {
      this.props.setVisible(false);
    }, 200);
  }
}
