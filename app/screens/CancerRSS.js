import React from 'react';
import { FlatList, Linking,AppRegistry, StyleSheet,ActivityIndicator, Text, WebView, View, Button, AsyncStorage} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
var XMLParser = require('react-xml-parser');


export default class CancerRSS extends React.Component {
    //Cite: https://facebook.github.io/react-native/docs/network
    constructor(props) {
        super(props);
       
        this.state = { isLoading: true}


        var xmlText = "<?xml version='1.0' encoding='utf-8'?>\
<Library>\
   <Books count='1'>\
       <Book id='1'>\
           <Name>Me Before You</Name>\
           <Author>Jojo Moyes</Author>\
       </Book>\
   </Books>\
   <Music count=1>\
       <CD id='2'>\
           <Name>Houses of the Holy</Name>\
           <Artist>Led Zeppelin</Artist>\
       </CD>\
   </Music>\
</Library>"

        var xml = new XMLParser().parseFromString(xmlText);    // Assume xmlText contains the example XML

       console.log(xml);

     //   console.log(xml.getElementsByTagName('Name'));

    }

    //Cite: https://gist.github.com/PhilipFlyvholm/d4171a16900cef6146b097a7ed432515

    componentDidMount() {
      // const rssURL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeed.rssunify.com%2F5cbc0dbe0657c%2Frss.xml&api_key=aw46lnwivmgetk7aos9xwiv1yb8xur8ogewi0epn&order_by=pubDate&order_dir=desc&count=50'
        const rssURL = 'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.feedburner.com/ncinewsreleases&api_key=aw46lnwivmgetk7aos9xwiv1yb8xur8ogewi0epn&order_by=pubDate&order_dir=desc&count=50'
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
                }, function () {

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


        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (

            <View style={{ flex: 1, paddingTop: 1, justifyContent: 'space-between' }}>
                {/* <Text style={styles.title}> Latest Cancer Research </Text> */}

                <FlatList
                    data={this.state.dataSource}

                    renderItem={({ item }) =>
                        //<Text style={styles.body}>{item.title}, {item.publicationDate}, {item.abstract}</Text>}

                        <View style={{ padding: 1 }}>

                            <Text style>Publication Date:{item.pubDate} </Text>

                            <Text
                                onPress={() => Linking.openURL(item.link)}>
                                {item.title}
                            </Text>


                            <Text style>Description:{item.description} </Text>
                            <Text style>Link:{item.link} </Text> 

      

                            {/*
                            <Text style={styles.pubDate} >Publication Date:{item.publicationDate} </Text>

                            <Text style={styles.articleTitle}
                                onPress={() => Linking.openURL(item.url[0].value)}>
                                {item.title}
                            </Text>


                            <Text style={styles.abstract}> {item.abstract} </Text>

                           
                            <Text style={styles.doi}
                                onPress={() => Linking.openURL(item.url[0].value)}>
                                {item.doi}
                            </Text>

                            */}
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,

                                    borderRadius: 5,
                                    padding: 5
                                }}
                            />

                        </View>
                    }
                    keyExtractor={(item, index) => item.guid}
                />
            </View>


















            
            );

    }
}