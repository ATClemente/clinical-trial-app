import React from 'react';
import { Image, ScrollView, StyleSheet, Text, BrowserView, WebView, View, FlatList } from 'react-native';
import DOMParser from 'react-native-html-parser';
import { Card, CardItem, Left, Body, Container, Content } from 'native-base';


export default class FDA_Drugs extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }

    }

    componentDidMount() {
        return fetch('http://clinical-trial-app.herokuapp.com/drugs', { method: 'GET' })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                    
                }, function () {

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (

            <FlatList
data={this.state.dataSource}
renderItem={this._renderItem}
/>
      


        );
    }



_renderItem = ({ item, index }) => {

return(


    <Text>

        {item.name}
    </Text>
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

