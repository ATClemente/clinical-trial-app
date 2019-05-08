import React from 'reactn';
import DropdownMenu from 'react-native-dropdown-menu';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
  Alert,
  TextInput,
  SafeAreaView,
  ReturnKeyType,
  Picker
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../components/GradientButton';
import { SearchBar } from 'react-native-elements';
import { Toast } from 'native-base';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ClinicalTrialSearchResults from '../components/ClinicalTrialSearchResults';
import SearchLocationModal from '../components/SearchLocationModal';
import { toastDelay } from '../constants/Constants';

export default class ClinicalTrialSearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { 
        searchLoading: false,
        hasNewSearchData: false,
        keyWordText: '',
        zipCodeText: '',
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
        text:'',
        showLocationModal: false,
        username: this.global.profile.username,
        email: this.global.profile.email,
        dob: this.global.profile.dob,
        gender: this.global.profile.gender,
        location: this.global.profile.location,
        cancerType: this.global.profile.cancerType,
    };
  }

  componentDidMount() {
    if (this.state.location) {
      this.setState({ zipCodeText: this.state.location });
    } else {
      this.setState({ showLocationModal: true });
    }
  }

  render() {
    const disableSearch = (this.state.keyWordText && this.state.zipCodeText) ? false : true;
    const disablePrev = this.state.prevParams == {} || this.state.currentPage == 1;
    const disableNext = this.state.prevParams == {} 
      || this.state.currentPage == Math.ceil(this.state.searchData.total / this.state.searchSize)
      || !this.state.keyWordText.length;
    const prevStyle = disablePrev ? [styles.pageButton, styles.disabled] : styles.pageButton;
    const nextStyle = disableNext ? [styles.pageButton, styles.disabled] : styles.pageButton;
    const tabColor = Colors.btnBlue;
    return (
      <SafeAreaView style={styles.container}>

        <SearchLocationModal
          visible={this.state.showLocationModal}
          setLocationModal={this.setLocationModal}
          setProfileLocation={this.setProfileLocation}
        />

        <View style={styles.inputView}>

          <SearchBar
            placeholder="Keywords"
            onChangeText={text => this.setState({ keyWordText: text})}
            value={this.state.keyWordText}
            searchIcon={{ name: 'md-key', type: 'ionicon' }}
            containerStyle={[
              styles.searchBarContainer, 
              {marginBottom: 8},
            ]}
            inputContainerStyle={styles.searchBarInput}
            inputStyle={styles.searchBarText}
            placeholderTextColor='#aaa'
            returnKeyType='search'
            onSubmitEditing={()=> this._doAPISearch()}
          />

          <View style={{ flexDirection: 'row' }}>
            <SearchBar
              placeholder="Zip Code"
              onChangeText={(text) => this.onZipCodeChanged(text)}
              value={this.state.zipCodeText}
              searchIcon={{ name: 'md-pin', type: 'ionicon' }}
              containerStyle={[styles.searchBarContainer, {width: '40%', marginTop: 4 }]}
              inputContainerStyle={styles.searchBarInput}
              inputStyle={styles.searchBarText}
              placeholderTextColor='#aaa'
              returnKeyType='search'
              keyboardType='numeric'
              maxLength={5}
              defaultValue={this.global.profile.location}
              onSubmitEditing={() => this._doAPISearch()}
            />

            <Picker
                selectedValue={this.state.desiredDistance}
                style={Platform.OS === 'ios' ? { height: 45, width: '35%', marginTop: 2 } : { height: 45, width: '35%' }}
                itemStyle={Platform.OS === 'ios' ? { height: 38, borderWidth: 0, fontSize: 18 } : { height: 45 }}
                mode='dropdown'
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

            <View style={{ alignSelf: 'center', width: '25%' }}>
                <GradientButton
                    colors={[Colors.blueOne, Colors.blueTwo]}
                    handleClick={() => this._doAPISearch()}
                    loading={false}
                    disabled={disableSearch}
                    text='Search'
                    padding={8}
                />
            </View>

          </View>
        </View>

        <View style={styles.pagingButtons}>

          <TouchableOpacity
            style={prevStyle}
            disabled={disablePrev}
            onPress={() => this._doAPISearch(true, -1)}
          >
            <View style={{ 
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start' 
            }}>
              <Ionicons 
                style={{ marginRight: 6, color: disablePrev ? 'grey' : tabColor }}
                size={24}
                name='ios-arrow-dropleft' />
              <Text style={{ color: disablePrev ? 'grey' : tabColor }}>Prev</Text>
            </View>
          </TouchableOpacity>

          { (this.state.searchData.total != undefined) && 
            <View style={{ 
              height: 24,
              paddingTop: 3,
            }}>
              <Text>Page {this.state.currentPage.toString()} of {Math.ceil(this.state.searchData.total / this.state.searchSize)}</Text>
            </View>
          }

          <TouchableOpacity
            style={nextStyle}
            disabled={disableNext}
            onPress={() => this._doAPISearch(true)}
          >
            <View style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <Text style={{ color: disableNext ? 'grey' : tabColor }}>Next</Text>
              <Ionicons 
                style={{ marginLeft: 6, color: disableNext ? 'grey' : tabColor }}
                size={24}
                name='ios-arrow-dropright' />
            </View>
          </TouchableOpacity>
        </View>

        {this.state.searchLoading &&
            <View style={styles.searchLoading}>
                <ActivityIndicator size='large' color="#0000ff" />
            </View>
        }


        {!this.state.searchLoading &&
          <ClinicalTrialSearchResults 
            searchData = {this.state.searchData} 
            currentPage = {this.state.currentPage}
            searchSize = {this.state.searchSize}
            searchRadius = {Number(this.state.desiredDistance)}/>
        }

      </SafeAreaView>
    );
  }

  _doAPISearch(pageSearch = false, pageDirection = 1, useInclude = true){
//ClinicalTrialAPIUtil.sendPostRequest(this.state.searchSize, 0, true, "active", "treatment", keyWordArg, zipCodeArg, this.state.distanceSelect)
    this.setState({searchLoading: true});
    Keyboard.dismiss();
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
              //this.logTrialByIndex(0);
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

  setLocationModal = visible => {
    this.setState({ showLocationModal: visible });
  }

  setProfileLocation = location => {
    this.setState({ location });
    this.setState({ zipCodeText: location });
    Toast.show({
      text: 'Profile updated',
      buttonText: 'Okay',
      type: 'success',
      duration: toastDelay
    });
  }

  _getTotalPageCount = () => {
    let totalPages = Math.ceil(this.props.searchData.total / this.props.searchSize);
    return totalPages.toString();
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
    width: '100%'
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
  distanceSelectPicker:{
    height: 50, 
    width: 50,
    //marginLeft: 60,
    borderWidth: 2,
    borderColor: '#7a42f4'
  },
  inputView:{
    marginTop: Platform.OS === 'ios' ? 5 : 40,
    paddingLeft: 20,
    paddingRight: 20,
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
    marginTop: Platform.OS === 'ios' ? 5 : 10,
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: "space-between"
  },
  pageButton: {
    height: 24,
    width: '20%',
  },
  pageButtonText: {
    // color: Colors.fbBlue1
  },
  searchBarContainer: {
    backgroundColor: '#fff', 
    padding: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInput: {
    backgroundColor: '#eee',
    height: 35
  },
  searchBarText: {
    color: '#222',
    fontSize: 16
  },
  disabled: {
    opacity: 0.5
  }
});
