import React from 'reactn';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import IosButton from './IosButton';

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.gender === '') {
      this.setState({ 
        gender: null,
        age: null,
        male: false,
        female: false
      });
    }
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
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '500', marginBottom: 10 }}>
              Select Gender
            </Text>
            <CheckBox
              title='Male'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              containerStyle={styles.radio}
              checked={this.state.male}
              onPress={this._setMale}
            />
            <CheckBox
              title='Female'
              iconType='ionicon'
              checkedIcon='md-radio-button-on'
              uncheckedIcon='md-radio-button-off'
              containerStyle={styles.radio}
              checked={this.state.female}
              onPress={this._setFemale}
            />
            <View style={{ marginTop: 20, marginBottom: 15 }}>
              <GradientButton
                colors={[Colors.radar2, Colors.radar3]}
                handleClick={() => { this.props.setGender(this.state.gender); this.props.setVisible(false)}}
                disabled={this.state.gender ? false : true}
                text='Update'
              />
            </View>
            <IosButton handleTouch={this._reset} title='Clear Filter' />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  _setMale = async () => {
    await this.setState({ male: true, female: false, gender: 'Male' });
  }

  _setFemale = async () => {
    await this.setState({ female: true, male: false, gender: 'Female' }); 
  }

  _reset = async () => {
    this.props.setGender('');
    this.props.setVisible(false);
  }

  _dismiss() {
    this.props.setGender(this.state.gender);
    setTimeout(() => {
      this.props.setVisible(false);
    }, 200);
  }
}

const styles = StyleSheet.create({
  radio: {
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#fff',
  }
});