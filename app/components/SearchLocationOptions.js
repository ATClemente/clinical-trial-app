import React from 'reactn';
import {
  Button,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { Form, Icon, Item, Input, Picker } from 'native-base';
import { CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import FormInput from './FormInput';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';

export default class SearchLocationOptions extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      location: this.global.location,
      radius: '',
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
              Set Location
            </Text>
            <Item underline>
              <Input 
                placeholder='90210'
                keyboardType='number-pad'
                maxLength={5}
                value={this.state.location}
                onChangeText={location => this.setState({ location })}
                placeholderTextColor='#aaa'
                style={{ fontSize: 16 }}
              />
            </Item>
            <CheckBox
              title='Within 10 miles'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.box1}
              onPress={this._set1}
            />
            <CheckBox
              title='Within 25 miles'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.box2}
              onPress={this._set2}
            />
            <CheckBox
              title='Within 50 miles'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.box3}
              onPress={this._set3}
            />
            <CheckBox
              title='Within 100 miles'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              checked={this.state.box4}
              onPress={this._set4}
            />
            {/* <View style={{ marginTop: 20, marginBottom: 15 }}>
              <GradientButton
                colors={[Colors.radar2, Colors.radar3]}
                handleClick={() => { this.props.setLocation(this.state.location); this.props.setVisible(false)}}
                text='Update'
              />
            </View> */}
            <Button onPress={() => {this.setState({ location: '', radius: '' }); this.props.setLocation(''); this.props.setVisible(false)}} title='Clear Filter' />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  _set1 = async () => {
    await this.setState({ box1: true, box2: false, box3: false, box4: false, radius: '10' });
    this._dismiss();
  }

  _set2 = async () => {
    await this.setState({ box1: false, box2: true, box3: false, box4: false, radius: '25' });
    this._dismiss();
  }

  _set3 = async () => {
    await this.setState({ box1: false, box2: false, box3: true, box4: false, radius: '50' });
    this._dismiss();
  }

  _set4 = async () => {
    await this.setState({ box1: false, box2: false, box3: false, box4: true, radius: '100' });
    this._dismiss();
  }

  _dismiss() {
    if (this.state.location.length && this.state.radius.length) {
      this.props.setRadius(this.state.radius);
      this.props.setLocation(this.state.location);
      setTimeout(() => {
        this.props.setVisible(false);
      }, 200);
    }
  }
}
