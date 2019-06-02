import React from 'react';
import { WebView } from 'react-native';

export default ({ navigation }) => {
  return (
    <WebView
      source={{ uri: navigation.state.params.uri}}
      startInLoadingState={true} javaScriptEnabled={true} domStorageEnabled={true} style={{ flex: 1 }}
    />
  );
}