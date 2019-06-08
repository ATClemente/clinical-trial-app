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
    AsyncStorage, 
    Image,
    Dimensions
} from 'react-native';
var XMLParser = require('react-xml-parser');
import { Card, CardItem, Left, Body, Container, Content } from 'native-base';
import GradientButton from '../components/GradientButton';
import Colors from '../constants/Colors';
import PopUpScreenModal from '../components/PopUpScreenModal'

/* Calculate image size based on screen minus margin on both sides */
const windowSize = Dimensions.get('screen');
const imgWidth = windowSize.width - 48;
const imgHeight = imgWidth / (230/173);

export default class CancerRSS extends React.Component {
    //Cite: https://facebook.github.io/react-native/docs/network
    constructor(props) {
        super(props);
               this.state = { isLoading: true, modalVisible: false, modalURL: '' }
    }


    _makeModalVisible = () => {
        this.setState({ modalVisible: true })
    }

    _hideModal = () => {
        // Make modal visible 
        this.setState({ modalVisible: false })

    }

    //Cite: https://gist.github.com/PhilipFlyvholm/d4171a16900cef6146b097a7ed432515

    componentDidMount() {
      // const rssURL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeed.rssunify.com%2F5cbc0dbe0657c%2Frss.xml&api_key=aw46lnwivmgetk7aos9xwiv1yb8xur8ogewi0epn&order_by=pubDate&order_dir=desc&count=50'
       // const rssURL = 'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.feedburner.com/ncinewsreleases&api_key=aw46lnwivmgetk7aos9xwiv1yb8xur8ogewi0epn&order_by=pubDate&order_dir=desc&count=50'
        //const rssURL = 'https://api.rss2json.com/v1/api.json?rss_url=https://feed.rssunify.com/5cd3956da2842/rss.xml&api_key=aw46lnwivmgetk7aos9xwiv1yb8xur8ogewi0epn&order_by=pubDate&order_dir=desc&count=70'
      //  const rssURL = 'http://feeds.feedburner.com/ncinewsreleases'
        const rssURL = 'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.feedburner.com/ncinewsreleases&api_key=aw46lnwivmgetk7aos9xwiv1yb8xur8ogewi0epn&order_by=pubDate&order_dir=desc&count=70'

        /*
        fetch(rssUrl)
            .then(response => response.json())
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

*/
        return fetch(rssURL)
            .then((response) => response.json())
            .then((responseJson) => {

                // console.log(responseJson.items)
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.items,
                });
                // console.log(this.state.dataSource);
            })
            .catch((error) => {
                console.error(error);
            });
    }


        /*
            .then((json) => {
                if (json.status === 'ok') {
                    //console.log(json)
                    console.log("barkuuus")
                } else {
                    console.log("failed");
                }
            });


        this.setState({
            rss: json.items
        });
    }


*/

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
            <Container style={{ paddingHorizontal: 5, backgroundColor: '#eee' }}>
                <Content >
                    <FlatList
                        style={{ marginVertical: 4 }}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.guid}
                    />
                    {/* <PopUpScreenModal
                        visible={this.state.modalVisible}
                        hideModal={this._hideModal}
                        url={this.state.modalURL}
                    /> */}
                </Content>
            </Container>
        );
    }


    _renderItem = ({ item }) => {
        // Image.getSize(item.enclosure.link, (width, height) => {
        //     console.log(`width ${width}, height ${height}`);
        // });
        return (
            <Card>
                <CardItem bordered style={{ flexDirection: 'column', alignItems: 'flex-start' }}>

                    <Text 
                        onPress={() => this.setState({ modalVisible: true, modalURL: item.link })}
                        style={styles.articleTitle}
                    >
                        {item.title}
                    </Text>
                    <Text style={{ color: '#999' }}>Publication Date: {item.pubDate}</Text>


                </CardItem>
                <CardItem>
                    <Body style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <Image
                            style={{ width: imgWidth, height: imgHeight, marginTop: 5, marginBottom: 10 }}
                            source={{ uri: item.enclosure.link }}
                        />
                        <Text style={{ width: '100%' }}>
                            Description: {item.description.replace('<p>', '').replace('</p>', '')} 
                        </Text>
                   
                      
                    </Body>
                
                </CardItem>
                <CardItem style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: '100%', marginBottom: 5 }}>
                        <GradientButton
                            colors={[Colors.blueOne, Colors.blueTwo]}
                            handleClick={() => this.props.navigation.navigate('NewsArticle', { uri: item.link }) } 
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