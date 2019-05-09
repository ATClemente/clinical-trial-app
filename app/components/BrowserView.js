import React, {Component} from 'react';
import {WebView} from 'react-native';

export default class BrowserView extends Component {
  render() {
    return (
      <WebView
            source={{ uri: this.props.url}}
       startInLoadingState={true} javaScriptEnabled={true} domStorageEnabled={true} style={{ flex: 1 }}
      />
    );
  }
}