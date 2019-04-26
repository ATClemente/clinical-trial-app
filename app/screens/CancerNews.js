import React from 'react';
import { FlatList, ActivityIndicator, Text, WebView, View, Button, AsyncStorage} from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class CancerNews extends React.Component {
   //Cite: https://facebook.github.io/react-native/docs/network

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        return fetch('http://api.springernature.com/metadata/json?q=keyword:immunotherapy sort:date year:2019&api_key=1578185c036380f5d680e30d3e8d7349&p=50', { method: 'GET' })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson.records,
                }, function () {

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }


    render() {

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={{ flex: 1, paddingTop: 1, justifyContent: 'space-between'}}>
                <Text> Latest Cancer Research </Text>

                <FlatList
                    data={this.state.dataSource}

                    renderItem={({ item }) => <Text>{item.title}, {item.publicationDate}</Text>}
                    keyExtractor={({ id }, index) => id}    
                />
            </View>
        );
    }
}


    /*
    //Cite: https://www.tutorialspoint.com/react_native/react_native_http.htm

    componentDidMount = () => {

        fetch('http://api.springernature.com/metadata/json?q=keyword:immunotherapy sort:date year:2019&api_key=1578185c036380f5d680e30d3e8d7349&p=50', { method: 'GET' })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    data: responseJson
                })
            })
            .catch((error) => {
                console.error(error);
            });

    }
    static navigationOptions = {
        title: 'Latest Cancer News',
    };

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };


    render() {

        return (



            <View>

                <Text> Find Latest Research on Cancer  </Text>
                <Text>
                    {this.state.data.body}
                </Text>
            </View>

        )


    }
    /*
    render() {

        // const feed = require('./index.html');
        return (
            <WebView
                //  source={{ feed }}
                source={require('./index.html')}
                originWhitelist={['*']}
                style={{ flex: 1 }}
            
            />
        );
    }

*/


//export default CancerNews;