import React from 'react';
import { FlatList, Linking,AppRegistry, Image, ScrollView, StyleSheet,ActivityIndicator, Text, WebView, View, Button, AsyncStorage} from 'react-native';
import { ExpoConfigView } from '@expo/samples';



export default class About extends React.Component {
   //Cite: https://facebook.github.io/react-native/docs/network

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        
    }


    render() {

        

        return (

            <ScrollView>
            <View>
                {/* <Text style={styles.title}> About </Text> */}

                <View style={{ alignItems: 'center', justifyContent: 'center'}} >
                <Image
                    style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center'}}
                    source={{
                        uri: 'https://media.glassdoor.com/sqll/1177597/zero-the-end-of-prostate-cancer-squarelogo-1455293657416.png'}}
                />
                </View>
                <Text style={styles.abstract}> Approximately 40% of men and women will be diagnosed with cancer in their lifetimes. Many
times, cancer is treated with traditional therapies such as chemotherapy, but the effectiveness
of such drugs can wane after repeated trials. When traditional treatment options fail to be as
effective, patients can turn to clinical trials and participate in novel therapies for cancer
treatment.Other resources that can increase a patient's likelihood of survival is to be informed of
the most recently approved cancer drugs by the FDA. Since there are many new cancer
treatments being released on a yearly basis, it is easy for general oncologists to not be aware of
these findings as our groupmates have found out through their own personal experiences.It is
thus important for patients to take the initiative to become made aware of these new therapies
to discuss them as options with a doctor or to at least be aware that they exist. Lastly, we
believe supplying people with articles on the latest research in cancer will allow them to be even
more informed on the current landscape of cancer treatment. Thus,this application seeks to allow patients and researchers to find clinical trials in a more user friendly
way, find information on newly approved cancer drugs, and find relevant research articles on
their illness  </Text>

                </View>
            </ScrollView>
        );
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
        fontSize: 17,
        padding:5,
       // alignItems: 'center',
       // textAlign: 'center',
        marginLeft: 15,
        marginRight: 15


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

        fontSize: 17,
        color: '#4d4d4d',
        // padding:10,
        // alignItems: 'center',
        // textAlign: 'center',
        marginLeft: 15, 
        marginTop: 15, 
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