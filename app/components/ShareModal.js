import React from 'reactn';
import {
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { Toast } from 'native-base';
import Urls from '../constants/Urls';
import { toastDelay } from '../constants/Constants';
import FormInput from '../components/FormInput';
import Modal from 'react-native-modal';
import GradientButton from './GradientButton';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

export default class ShareModal extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
      shared: false,
    }
  }

  async componentWillReceiveProps(nextProps) {
    await this.setState({ shared: false, email: '' });
  }

  render() {
    if (!this.state.shared) {
      return (
        <Modal
          isVisible={this.props.visible}
          avoidKeyboard={true}
          onRequestClose={() => this.props.setVisible(false)}
        >
          <SafeAreaView style={Styles.optionsModalContainer}>
            <View style={{ width: '100%' }}>
              <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '500', marginBottom: 10 }}>
                Share Trial
              </Text>
              <FormInput
                label='Email'
                placeholder='john@doe.com'
                keyboardType='email-address'
                autoCapitalize='none'
                value={this.state.email}
                onChangeText={email => { this.setState({ email });
                }}
              />
              <View style={{ marginVertical: 10 }}>
                <GradientButton
                  colors={[Colors.radar2, Colors.radar3]}
                  handleClick={ this._shareTrial }
                  loading={this.state.loading}
                  disabled={!this._isEmailValid() || this.state.loading}
                  text='Send Email'
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.setVisible(false)}>
                  <Text style={{ color: '#0078ff', fontSize: 16 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    } else {
      return (
        <Modal
          isVisible={this.props.visible}
          avoidKeyboard={true}
          onRequestClose={() => this.props.setVisible(false)}
        >
          <SafeAreaView style={Styles.optionsModalContainer}>
            <View style={{ width: '100%' }}>
              <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '500', marginBottom: 10 }}>
                Share Trial
              </Text>
              <View style={{ padding: 30 }}>
                <Text style={{ textAlign: 'center' }}>Trial successfully shared.</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.setVisible(false)}>
                  <Text style={{ color: '#0078ff', fontSize: 16 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }
  }

  _shareTrial = async () => {
    await this.setState({ loading: true });
    try {
      const { data } = await axios.post(
        Urls.server + '/user/trials/share',
        {
          email: this.state.email,
          username: this.global.profile.username,
          trial: this.props.trial,
        },
        {
          headers: {
            Authorization: this.global.token,
            'Content-Type': 'application/json'
          }
        }
      );
      await this.setState({ shared: true });
    } catch (e) {
      console.log(e);
    }
    await this.setState({ loading: false });
  }

  _isEmailValid = () => {
    let email = this.state.email;
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(String(email).toLowerCase())
  }
}