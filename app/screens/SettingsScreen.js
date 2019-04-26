import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { WebView } from 'react-native';


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

    
    //https://medium.com/@snehabagri.90/reactnative-webview-with-local-content-c98a09340801
    //https://stackoverflow.com/questions/42851296/react-native-load-local-html-file-into-webview
  //render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */

    /*
    return (
      <View>
        <ExpoConfigView />
        <Button title="Sign Out" onPress={this._signOutAsync} />
      </View>
    );
  }
  */

    render() {

       // const feed = require('./index.html');
        return (
            <WebView
              //  source={{ feed }}
                source={ require('./index.html')}
                originWhitelist={['*']}
                style={{ flex: 1 }}
                /*
                source={{ uri: 'http://feeds.feedburner.com/cancer-currents' }}
                style={{ marginTop: 20 }}*/
            />
        );
    }


}
