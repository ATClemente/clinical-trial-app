import React from 'react';
import DropdownMenu from 'react-native-dropdown-menu';
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
  ReturnKeyType,
  Picker
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ClinicalTrialSearchResults from '../components/ClinicalTrialSearchResults';

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
        //distanceSelect: "10",
        searchSize: 5,
        resultsFromIndex: 0, //Just add searchSize for next batch when needed.
        searchData: {},
        prevParams: {},
        desiredStatus: "active",
        desiredPurpose: "treatment",
        desiredDistance: "10",
        desiredDistanceType: "mi",
        currentPage: 1,
        text:' '
    };

  }

    render() {

        var data = [["10","20","30","40","50"]];

    return (
      <View style={styles.container}>
            <View style={styles.inputView}>


                {/*<Text> Search by keywords:</Text>*/}
          <TextInput style = {styles.keyWordSearchBox}
                    placeholder="Search clinical trials by keywords"
                    placeholderTextColor='rgb(80,80,80)'
                    returnKeyType="search"
                    onSubmitEditing={() => this._doAPISearch()
                    }
              onChangeText={(text) => this.setState({keyWordText: text})}
              value={this.state.keyWordText}
          />

                {/* <Text>Search by Zip code:</Text> */}
          <View style={styles.distanceInputs}>
            <TextInput style = {styles.zipCodeSearchBox}
                keyboardType = "numeric"
                        placeholder="Search by zipcode"
                        placeholderTextColor='rgb(80,80,80)'
                        returnKeyType="search"
                        onSubmitEditing={() => this._doAPISearch()}

                onChangeText={(text) => this.onZipCodeChanged(text)}
                value={this.state.zipCodeText}
            />


                    {/*}

            <Picker
                selectedValue={this.state.desiredDistance}
                style={styles.distanceSelectPicker}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({desiredDistance: itemValue})
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

*/}
                    <View>
                    <DropdownMenu
                        style={{ flex: 1 }}
                        bgColor={'white'}
                        tintColor={'#666666'}
                        activityTintColor={'green'}
                        // arrowImg={}      
                        // checkImage={}   
                        // optionTextStyle={{color: '#333333'}}
                        // titleStyle={{color: '#333333'}} 
                        // maxHeight={300} 
                        handler={(selection, row) => this.setState({ text: data[selection][row] })}
                        data={data}
                    >

                        <View style={{ flex: 1 }}>
                            <Text>
                                {this.state.text} miles away
            </Text>
                        </View>

                    </DropdownMenu>
                        </View> 





            <View style={styles.searchButtonHolder}>
              <Button
              onPress={() => this._doAPISearch()}
              title="Search"
              />
            </View>
                

                    {/*
                    <TextInput
                        placeholder = "het"
                        returnKeyType= "search"
                        onSubmitEditing={() => this._doAPISearch()
                        } />
                        */}


          </View>

   




        
        
        </View>

        <View style={styles.pagingButtons}>

          <Button
              disabled={this.state.prevParams == {} || this.state.currentPage == 1}
              onPress={() => this._doAPISearch(true, -1)}
              title="Prev"
          />
          <Button
            disabled={this.state.prevParams == {} || this.state.currentPage == Math.ceil(this.state.searchData.total / this.state.searchSize)}
            onPress={() => this._doAPISearch(true)}
            title="Next"
          />
        </View>

        {this.state.searchLoading &&
            <View style={styles.searchLoading}>
                <ActivityIndicator size={128} color="#0000ff" />
            </View>
        }


        {!this.state.searchLoading &&
          <ClinicalTrialSearchResults searchData = {this.state.searchData} currentPage = {this.state.currentPage} searchSize = {this.state.searchSize}/>
        }

      </View>
    );
  }

  _doAPISearch(pageSearch = false, pageDirection = 1, useInclude = true){
//ClinicalTrialAPIUtil.sendPostRequest(this.state.searchSize, 0, true, "active", "treatment", keyWordArg, zipCodeArg, this.state.distanceSelect)
    this.setState({searchLoading: true});
    var params = {};
    if(!pageSearch){

      this.state.resultsFromIndex = 0;
      this.state.currentPage = 1;

      params[QueryConstants.SIZE_STR] = this.state.searchSize;
      params[QueryConstants.FROM_STR] = this.state.resultsFromIndex;
      params[QueryConstants.CURRENT_TRIAL_STATUS_STR] = this.state.desiredStatus;
      params[QueryConstants.PURPOSE_CODE_STR] = this.state.desiredPurpose;

      let keyWordArg = this.state.keyWordText.trim();
      let zipCodeArg = this.state.zipCodeText.trim();

      if(zipCodeArg.length == 5){
        params[QueryConstants.POSTAL_CODE_STR] = zipCodeArg;
        params[QueryConstants.DISTANCE_STR] = (this.state.desiredDistance + this.state.desiredDistanceType);
      }
      else if(zipCodeArg != ""){
        this.zipCodeInvalidAlert();
        this.setState({searchLoading: false});
        return;
      }
      if(keyWordArg !== "" && keyWordArg !== null ){
        params[QueryConstants.KEYWORD_STR] = keyWordArg.toLowerCase();
      }
      if(useInclude){
        params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;
      }
    }
    else{
      //this.state.prevParams[QueryConstants.FROM_STR] += this.state.searchSize;
      //this.state.currentPage++;
      let localParams = this.state.prevParams;
      localParams[QueryConstants.FROM_STR] += (this.state.searchSize * pageDirection);
      if(localParams[QueryConstants.FROM_STR] < 0){
        localParams[QueryConstants.FROM_STR] = 0;
      }
      this.setState({prevParams: localParams});
      let newPage = this.state.currentPage + pageDirection;
      if(newPage <= 0){
        newPage = 1;
      }
      this.setState({currentPage: newPage});
      params = this.state.prevParams;
    }

    /*let keyWordArg = this.state.keyWordText.trim();
    let zipCodeArg = this.state.zipCodeText.trim();
    if(zipCodeArg == ""){
      zipCodeArg = null
    }
    else if (zipCodeArg.length != 5){
      this.zipCodeInvalidAlert();
      this.setState({searchLoading: false});
      return;
    }*/  
    ClinicalTrialAPIUtil.sendPostRequest(params)
    .then((response) => {
        if(response.total === undefined){
            console.log(response);
            this.searchErrorAlert();
            this.setState({searchLoading: false});
        }
        else if(response.total == 0){
          this.noResultsAlert();
            this.setState({searchLoading: false});
        }
        else{
            if(response.trials.length > 0){
              this.setState({searchLoading: false});
              this.setState({searchData: response});
              this.setState({prevParams: params});
              console.log(response.total);
              //console.log(ClinicalTrialAPIUtil.getAgeRestrictions(this.state.searchData.trials[0]));
              //console.log(ClinicalTrialAPIUtil.getGenderRestrictions(this.state.searchData.trials[0]));
              this.logTrialByIndex(0);
              //console.log(response.trials[0].brief_title);  
              //this.setState({hasNewSearchData: true}); 
            }
            else{
              //Likely a "from" index was sent higher than was valid 
              this.setState({currentPage: this.state.currentPage - 1});
              this.setState({searchLoading: false});
              this.noMorePages();
            }
        }
    });                                                     
  }


  zipCodeInvalidAlert(){
    Alert.alert(
      'Invalid Zip Code',
      'Zip code format is invalid. Please enter your 5 digit zipcode if you would like to search by location',
      [
        {text: 'OK', onPress: () => {}},
      ],
      { cancelable: false }
    );
  }

  searchErrorAlert(){
    Alert.alert(
      'Search Error',
      'Search resulted in error. Please refine and try again',
      [
        {text: 'OK', onPress: () => {}},
      ],
      { cancelable: false }
    );
  }

  noResultsAlert(){
    Alert.alert(
      'No results',
      'No results found! Change search terms and try again.',
      [
        {text: 'OK', onPress: () => {}},
      ],
      { cancelable: false }
    );
  }

  noMorePages(){
    Alert.alert(
      'No more pages',
      'There are no more pages in the results.',
      [
        {text: 'OK', onPress: () => {}},
      ],
      { cancelable: false }
    );
  }

  onZipCodeChanged(text){
    this.setState({zipCodeText: text.replace(/[^0-9]/g, '').substring(0,5)});
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
    zIndex: 1 //Hacky for now. Gets ActivityIndicator to appear above button.
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
    justifyContent: 'center',
    zIndex: 10 //Part of said hack
  },
  keyWordSearchBox:{
    marginTop: 2,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    height: 40,
    borderColor: 'grey',
    borderWidth: 2,
      paddingLeft: 6,
      borderRadius: 3,
      paddingRight: 6,
    shadowColor:'grey',
      color: 'rgb(80,80,80)',
      fontWeight: 'bold', 

    },

  zipCodeSearchBox:{
    marginTop: 2,
    //marginLeft: 45,
    marginRight: 20,
    marginBottom: 10,
      height: 40,
    borderRadius:3,
    borderColor: 'grey',
    borderWidth: 2,
    paddingLeft: 6,
      paddingRight: 6,
      color: 'rgb(80,80,80)',
      fontWeight: 'bold',
      shadowColor: 'grey', 
      shadowRadius: 2
  },
  distanceSelectPicker:{
    height: 50, 
    width: 50,
    //marginLeft: 60,
    borderWidth: 2,
    borderColor: '#7a42f4'
  },
  inputView:{
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 15
  },
  distanceInputs:{
    flexDirection: "row"
  },
  searchButtonHolder:{
    marginLeft: 10,
    //alignItems: "center",
    marginTop: 7.5,
    width: "40%",
    zIndex: 1 //Hacky for now. Gets ActivityIndicator to appear above button.
  },
  pagingButtons: {
    zIndex: 1,
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 15,
    justifyContent: "space-between"
  }
});
