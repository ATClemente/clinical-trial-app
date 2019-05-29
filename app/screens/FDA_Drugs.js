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
keyExtractor={(item, index) => item.id}

/>
      


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
                        onPress={() => Linking.openURL(item.link)}
                        style={styles.articleTitle}
                    >
                        {item.name}
                    </Text>
                    <Text style={{ color: 'black' }}>Approval date: {item.approval_date}</Text>


                </CardItem>
                <CardItem>
                    <Body style={{ justifyContent: 'center', alignItems: 'center' }}>

                        
                        <Text style={{ width: '100%' }}>
                            Description: {item.description.replace('<p>', '').replace('</p>', '')} 
                        </Text>
                   
                      
                    </Body>
                
                </CardItem>
                <CardItem style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ width: '100%', marginBottom: 5 }}>
                        <GradientButton
                            colors={[Colors.blueOne, Colors.blueTwo]}
                            handleClick={() => Linking.openURL(item.link)}
                            loading={false}
                            disabled={false}
                            text='View Drug Article'
                            padding={10}
                        />
                    </View>
                </CardItem>
            </Card>
        )
    }



/*}
_renderItem = ({ item, index }) => {

return(



    <Text>

        {item.name}
        
        {item.manufacturer}
        {item.description}
        {item.approval_date}
    </Text>


<View style={{ width: '100%', marginBottom: 5 }}>
<GradientButton
    colors={[Colors.blueOne, Colors.blueTwo]}
    handleClick={() => Linking.openURL(item.link)}
    loading={false}
    disabled={false}
    text='View Information on Drug Article'
    padding={10}
/>
</View>


);


}
*/

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