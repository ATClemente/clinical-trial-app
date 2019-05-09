import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';

export default class PopUpScreenModal extends Component {
    state = {
        modalVisible: false,
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <View style={{ marginTop: 22 }}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>


                    <IconButton
                        icon='ios-arrow-dropleft'
                        side='left'
                       // disabled={disablePrev}
                      //  handleTouch={() => this._doAPISearch(true, -1)}
                        text='Back'
                        textColor='grey'
                        iconColor= 'black'
                    />






                    
                </Modal>

               
            </View>
        );
    }
}
