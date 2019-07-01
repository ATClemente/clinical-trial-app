import React from 'reactn';
import {
  Keyboard,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { CheckBox, Slider } from 'react-native-elements';
import Modal from 'react-native-modal';
import FormInput from './FormInput';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import IosButton from './IosButton';

export default class SearchLocationOptions extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      location: this.props.searchLocation,
      radius: 10,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ location: nextProps.searchLocation });
  }

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        avoidKeyboard={true}
        onRequestClose={() => this.props.setVisible(false)}
      >
        <SafeAreaView style={Styles.optionsModalContainer}>
          <View style={{ width: '100%' }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, marginBottom: 10 }}>
              Set Location
            </Text>
            {/* <Item underline>
              <Input 
                placeholder='Zip code'
                keyboardType='number-pad'
                maxLength={5}
                value={this.state.location}
                onChangeText={location => this.setState({ location })}
                placeholderTextColor='#aaa'
                style={{ fontSize: 16 }}
              />
            </Item> */}
            <FormInput
              label='Location'
              placeholder='90210'
              keyboardType='number-pad'
              maxLength={5}
              value={this.state.location}
              onChangeText={location => { this.setState({ location }); 
                if(location.length == 5) {
                  Keyboard.dismiss();
                }
              }}
            />
            <View>
              <View style={{ width: '100%', alignContent: 'stretch' }}>
                <Slider
                  value={this.state.radius}
                  onValueChange={value => this.setState({ radius: value })}
                  maximumValue={100}
                  minimumValue={10}
                  step={10}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: '500' }}>Radius: </Text>
                <Text>{this.state.radius}</Text>
                <Text> miles</Text>
              </View>
            </View>
            <View style={{ marginTop: 20, marginBottom: 15 }}>
              <GradientButton
                colors={[Colors.radar2, Colors.radar3]}
                handleClick={this._updateLocation}
                disabled={this.state.location ? false : true}
                text='Update'
              />
            </View>
            <IosButton handleTouch={this._reset} title='Clear Filter' />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  _reset = async () => {
    await this.setState({ location: '', radius: 10 }); 
    this.props.setLocation(''); 
    this.props.setVisible(false);
  }

  _updateLocation = () => {
    this.props.setLocation(this.state.location); 
    this.props.setRadius(this.state.radius); 
    this.props.setVisible(false);
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
