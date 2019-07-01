import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, SafeAreaView, View, WebView, Alert } from 'react-native';
import IconButton from '../components/IconButton'
import BrowserView from '../components/BrowserView'


export default class PopUpScreenModal extends Component {
    render() {
        return (
            <View style={{ marginTop: 22 }}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.visible}
                    onRequestClose={() => this.props.hideModal() }>

                    <SafeAreaView style={{ height: '100%', width: '100%'}}>
                        <IconButton
                            icon='ios-arrow-dropleft'
                            side='left'
                            text='Back'
                            handleTouch={this.props.hideModal}
                            textColor='grey'
                            iconColor= 'black'
                            style={{ padding: 5 }}
                        />

                        <BrowserView url={this.props.url} />
     
                    </SafeAreaView>
    
                </Modal>

            </View>
        );
    }
}
