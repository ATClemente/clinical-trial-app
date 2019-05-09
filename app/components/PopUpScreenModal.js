import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, SafeAreaView, View, WebView, Alert } from 'react-native';
import IconButton from '../components/IconButton'
import BrowserView from '../components/BrowserView'


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
                    visible={this.props.visible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>

                    <SafeAreaView style={{ height: '100%', width: '100%'}}>
                    <IconButton

                        icon='ios-arrow-dropleft'
                        side='left'
                       // disabled={disablePrev}
                      //  handleTouch={() => this._doAPISearch(true, -1)}
                        text='Back'
                        handleTouch={this.props.setVisible}
                        textColor='grey'
                        iconColor= 'black'
                        />


                        <BrowserView url={this.props.url}   />                       
     
    
                    </SafeAreaView>
    
                    
                </Modal>

               
            </View>
        );
    }
}
