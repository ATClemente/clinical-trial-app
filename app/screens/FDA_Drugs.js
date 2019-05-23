import React from 'react';
import { Image, ScrollView, StyleSheet, Text, BrowserView, WebView, View } from 'react-native';
import DOMParser from 'react-native-html-parser';

export default class FDA_Drugs extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }


    fetch('https://www.centerwatch.com/drug-information/fda-approved-drugs/therapeutic-area/12/oncology').then((response) => {
   const html = response.text();    
   const parser = new DOMParser.DOMParser();
   const parsed = parser.parseFromString(html, 'text/html');
   const test = parsed.getElementsById('ctl00_BodyContent_AreaDetails');
    console.log(test)
});
    }

    render() {



        
        return (

        <View>
            <Text> hi </Text>
            </View>


        );
    }
}

styles = StyleSheet.create({
    abstract: {
        fontSize: 17,
        color: '#4d4d4d',
        // padding:10,
        // alignItems: 'center',
        // textAlign: 'center',
        marginLeft: 15,
        marginTop: 15,
        marginRight: 15
    }
})

