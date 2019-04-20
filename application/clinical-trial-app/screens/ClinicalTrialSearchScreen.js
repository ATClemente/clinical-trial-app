import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
  Alert,
  TextInput,
  Picker
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';

export default class ClinicalTrialSearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { 
        searchLoading: false,
        hasNewSearchData: false,
        keyWordText: "",
        zipCodeText: "",
        distanceSelect: "10",
        searchData: {} 
    };

  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={{
              paddingTop: 30,
              paddingLeft: 30,
              paddingRight: 30,
              paddingBottom: 15
            }}
            >
            <Text>Search by keywords:</Text>
            <TextInput style = {styles.keyWordSearchBox}
                placeholder = "Enter search terms"
                onChangeText={(text) => this.setState({keyWordText: text})}
                value={this.state.keyWordText}
            />

            <Text>Search by Zip code:</Text>
            <TextInput style = {styles.zipCodeSearchBox}
                keyboardType = "numeric"
                placeholder = "#####"
                onChangeText={(text) => this.onZipCodeChanged(text)}
                value={this.state.zipCodeText}
            />

            <Picker
                selectedValue={this.state.distanceSelect}
                style={styles.distanceSelectPicker}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({distanceSelect: itemValue})
                }>
                <Picker.Item label="10mi" value="10" />
                <Picker.Item label="20mi" value="20" />
                <Picker.Item label="30mi" value="30" />
                <Picker.Item label="40mi" value="40" />
                <Picker.Item label="50mi" value="50" />
                <Picker.Item label="60mi" value="60" />
                <Picker.Item label="70mi" value="70" />
                <Picker.Item label="80mi" value="80" />
                <Picker.Item label="90mi" value="90" />
                <Picker.Item label="100mi" value="100" />
            </Picker>

          </View>

          <View style={styles.getStartedContainer}>

            <Button
              onPress={() => this._testPostAPIRequest()}
              title="Search!"
            />

          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>

        {this.state.searchLoading &&
            <View style={styles.searchLoading}>
                <ActivityIndicator size={128} color="#0000ff" />
            </View>
        }

        {this.state.hasNewSearchData && 
            this._respondToRequest()
        }

      </View>
    );
  }

  _testPostAPIRequest(){
    this.setState({searchLoading: true});
    //this.setState({hasNewSearchData: false});   
    ClinicalTrialAPIUtil.sendPostRequest(5, true, "active", "treatment", this.state.keyWordText, this.state.zipCodeText, this.state.distanceSelect)
    .then((response) => {
        if(response.total === undefined){
            console.log(response);
            Alert.alert("Search resulted in error. Please refine and try again");
            this.setState({searchLoading: false});
        }
        else if(response.total == 0){
            Alert.alert("No results! Change search terms and try again.");
            this.setState({searchLoading: false});
        }
        else{
            this.setState({searchLoading: false});
            this.setState({searchData: response});
            console.log(response.total);
            //console.log(ClinicalTrialAPIUtil.getAgeRestrictions(this.state.searchData.trials[0]));
            //console.log(ClinicalTrialAPIUtil.getGenderRestrictions(this.state.searchData.trials[0]));
            this.logTrialByIndex(0);
            //console.log(response.trials[0].brief_title);  
            //this.setState({hasNewSearchData: true}); 
        }
    });                                                     
  }

  onZipCodeChanged(text){
    this.setState({zipCodeText: text.replace(/[^0-9]/g, '')});
  }

  _testFunc(){
    Alert.alert("TEST!");
  }

  logTrialByIndex(index){
    if(!this.state.searchData){
        console.log("No search data!");
    }
    else{
        /*var currTrial = this.state.searchData.trials[index];
        for(var prop in currTrial){
            console.log(prop + ": " + currTrial[prop]);
        }*/
        //Not exhaustive but good example about how properties can be retrieved from response
        var currTrial = this.state.searchData.trials[index];
        console.log("NCT_ID: " + currTrial[QueryConstants.NCT_ID]);
        console.log("Brief title: " + currTrial[QueryConstants.BRIEF_TITLE]);
        console.log("Brief Summary: " + currTrial[QueryConstants.BRIEF_SUMMARY]);
        console.log("Phase: " + currTrial[QueryConstants.PHASE][QueryConstants.PHASE]);
        console.log("Phase additional qualifier code: " + currTrial[QueryConstants.PHASE][QueryConstants.PHASE_ADDITIONAL_QUALIFIER_CODE]);
        console.log("Phase other text: " + currTrial[QueryConstants.PHASE][QueryConstants.PHASE_OTHER_TEXT]);
        console.log("Start date: " + currTrial[QueryConstants.START_DATE]);
        console.log("Completion date: " + currTrial[QueryConstants.COMPLETION_DATE]);
        console.log("Central Contact:");
        console.log("Central Contact Email: " + currTrial[QueryConstants.CENTRAL_CONTACT][QueryConstants.CENTRAL_CONTACT_EMAIL]);
        console.log("Central Contact Name: " + currTrial[QueryConstants.CENTRAL_CONTACT][QueryConstants.CENTRAL_CONTACT_NAME]);
        console.log("Central Contact Phone: " + currTrial[QueryConstants.CENTRAL_CONTACT][QueryConstants.CENTRAL_CONTACT_PHONE]);
        console.log("Central Contact Type: " + currTrial[QueryConstants.CENTRAL_CONTACT][QueryConstants.CENTRAL_CONTACT_TYPE]);
        //Just print first disease
        console.log("Disease:");
        console.log("Disease code: " + currTrial[QueryConstants.DISEASES][0][QueryConstants.DISEASE_CODE]);
        console.log("Disease thesearus id: " + currTrial[QueryConstants.DISEASES][0][QueryConstants.NCI_THESAURUS_CONCEPT_ID]);
        console.log("Disease preferred name: " + currTrial[QueryConstants.DISEASES][0][QueryConstants.PREFERRED_NAME]);

        console.log("Eligibility:");
        console.log("Eligibile gender: " + currTrial[QueryConstants.ELIGIBILITY][QueryConstants.STRUCTURED][QueryConstants.GENDER]); 
        console.log("Eligibile minimum age: " + currTrial[QueryConstants.ELIGIBILITY][QueryConstants.STRUCTURED][QueryConstants.MIN_AGE]);
        console.log("Unstructured: " +currTrial[QueryConstants.ELIGIBILITY][QueryConstants.UNSTRUCTURED][0][QueryConstants.DESCRIPTION]);
        
        console.log("Lead org: " + currTrial[QueryConstants.LEAD_ORG]);
        console.log("Principal Investigator: " + currTrial[QueryConstants.PRINCIPAL_INVESTIGATOR]);

        //Just first site:
        console.log("Site: ");
        console.log("Contact name: " + currTrial[QueryConstants.SITES][0][QueryConstants.CONTACT_NAME]);
        console.log("Contact phone: " + currTrial[QueryConstants.SITES][0][QueryConstants.CONTACT_PHONE]);
        console.log("Status: " + currTrial[QueryConstants.SITES][0][QueryConstants.ORG_STATUS]);
        console.log("Coordinates: ");
        console.log("LATITUDE: " + currTrial[QueryConstants.SITES][0][QueryConstants.ORG_CORRDINATES][QueryConstants.LAT]);
        console.log("LATITUDE: " + currTrial[QueryConstants.SITES][0][QueryConstants.ORG_CORRDINATES][QueryConstants.LON]);
    }
  }

  _respondToRequest(){
    //this.setState({hasNewSearchData: false});
    Alert.alert(this.state.searchData.total.toString());
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  searchLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.80,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  keyWordSearchBox:{
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 2,
    paddingLeft: 6,
    paddingRight: 6
  },
  zipCodeSearchBox:{
    marginTop: 10,
    marginLeft: 45,
    marginRight: 45,
    marginBottom: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 2,
    paddingLeft: 6,
    paddingRight: 6
  },
  distanceSelectPicker:{
    height: 50, 
    width: 100,
    marginLeft: 60,
    borderWidth: 2,
    borderColor: '#7a42f4'
  }
});
