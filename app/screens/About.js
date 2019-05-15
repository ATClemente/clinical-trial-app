import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View} from 'react-native';

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    static navigationOptions = {
        title: 'About',
    };

    render() {
        return (
            <ScrollView>
            <View>
                <View style={{ alignItems: 'center', justifyContent: 'center'}} >
                <Image
                    style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center'}}
                    source={{
                        uri: 'https://media.glassdoor.com/sqll/1177597/zero-the-end-of-prostate-cancer-squarelogo-1455293657416.png'}}
                />
                </View>
                <Text style={styles.abstract}>Approximately 40% of men and women will be diagnosed with cancer in their lifetimes. Many
            times, cancer is treated with traditional therapies such as chemotherapy, but the effectiveness
            of such drugs can wane after repeated trials. When traditional treatment options fail to be as
            effective, patients can turn to clinical trials and participate in novel therapies for cancer
            treatment.Other ways that help increase a patient's likelihood of survival is to be informed of
            the most recently FDA approved cancer drugs. Since many new cancer
            treatments are released on a yearly basis, it is helpful to stay atop of the most recent developments.
            Lastly, this application  shows articles on the latest research and news on cancer, which will allow people to be even
            more informed on the current landscape of cancer treatment. 
           
                           
            </Text>

                </View>
            </ScrollView>
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