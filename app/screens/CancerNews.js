import React from 'react';
import { 
    FlatList, 
    Linking,
    AppRegistry, 
    StyleSheet,
    ActivityIndicator, 
    Text, 
    WebView, 
    View, 
    Button, 
    AsyncStorage
} from 'react-native';
import { Card, CardItem, Left, Body, Container, Content } from 'native-base';
import GradientButton from '../components/GradientButton';
import Colors from '../constants/Colors';

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
        // console.log(this.state.dataSource);
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <Container style={{ paddingHorizontal: 5, backgroundColor: '#ddd' }}>
                <Content >
                    <FlatList
                        style={{ marginVertical: 4 }}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.doi}    
                    />
                </Content>
            </Container>
        );
    }

    _renderItem = ({ item, index }) => {
        //<Text style={styles.body}>{item.title}, {item.publicationDate}, {item.abstract}</Text>}
        return (
            <Card>
                <CardItem bordered style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text 
                        style={styles.articleTitle}
                        onPress={() => Linking.openURL(item.url[0].value)}
                    >
                        {item.title}
                    </Text>
                    <Text style={{ color: '#999' }}>Publication Date: {item.publicationDate}</Text>
                </CardItem>
                <CardItem>
                    <Body>
                        <Text>
                            {item.abstract}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: '100%', marginBottom: 5 }}>
                    <GradientButton
                        colors={[Colors.blueOne, Colors.blueTwo]}
                        handleClick={() => Linking.openURL(item.url[0].value)}
                        loading={false}
                        disabled={false}
                        text='View Article'
                        padding={10}
                    />
                    </View>
                </CardItem>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'Georgia'

    },

    articleTitle: {
        fontWeight: 'bold',
        color: '#3961a3',
        fontSize: 17,
        marginBottom: 3
    },

    doi: {
        color: 'blue',
        marginLeft: 15,
        marginRight: 15
    },

    pubDate: {
        fontWeight: 'bold',
        fontSize: 17,
        padding: 5,
                // alignItems: 'center',
                // textAlign: 'center',
        marginLeft: 15,
        marginRight: 15


},

    abstract: {

        fontSize: 15,
        color: '#4d4d4d',
        // padding:10,
        // alignItems: 'center',
        // textAlign: 'center',
        marginLeft: 15, 
        marginRight: 15
        
    },

    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    body: {
        color: 'black',
        padding: 10,
    },
});
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



                            <Text style={{ color: 'blue' }}
                                onPress={() => Linking.openURL('http://google.com')}>
                                Google
                            </Text>
                             <Text style={styles.articleTitle}>{item.title}</Text>

*/


//export default CancerNews;