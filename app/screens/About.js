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
treatment.Other resources that can increase a patient's likelihood of survival is to be informed of
the most recently approved cancer drugs by the FDA. Since there are many new cancer
treatments being released on a yearly basis, it is easy for general oncologists to not be aware of
these findings as our groupmates have found out through their own personal experiences.It is
thus important for patients to take the initiative to become made aware of these new therapies
to discuss them as options with a doctor or to at least be aware that they exist. Lastly, we
believe supplying people with articles on the latest research in cancer will allow them to be even
more informed on the current landscape of cancer treatment. Thus,this application seeks to allow patients and researchers to find clinical trials in a more user friendly
way, find information on newly approved cancer drugs, and find relevant research articles on
their illness</Text>

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