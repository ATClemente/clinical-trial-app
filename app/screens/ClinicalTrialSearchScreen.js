import React from 'reactn';
import {
  Platform,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import SearchOptionsButton from '../components/SearchOptionsButton';
import SearchLocationOptions from '../components/SearchLocationOptions';
import SearchGenderOptions from '../components/SearchGenderOptions';
import SearchPhaseOptions from '../components/SearchPhaseOptions';
import { SearchBar } from 'react-native-elements';
import { Toast } from 'native-base';
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
        searchLocation: '',
        searchSize: 20,
        resultsFromIndex: 0,
        searchDataTotal: null,
        searchDataTrials: [],
        prevParams: {},
        desiredStatus: "active",
        desiredPurpose: "treatment",
        desiredDistance: '10',
        desiredDistanceType: "mi",
        currentPage: 1,
        text:'',
        showLocationModal: false,
        showLocationOptions: false,
        showGenderOptions: false,
        showPhaseOptions: false,
        phase: '',
        username: this.global.profile.username,
        email: this.global.profile.email,
        dob: this.global.profile.dob,
        gender: '',
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
    return (
      <SafeAreaView style={styles.container}>

        <SearchLocationModal
          visible={this.state.showLocationModal}
          setLocationModal={this.setLocationModal}
          setSearchLocation={this.setSearchLocation}
        />

        <SearchBar
          placeholder="Keywords"
          onChangeText={text => this.setState({ keyWordText: text})}
          value={this.state.keyWordText}
          searchIcon={{ name: 'md-key', type: 'ionicon' }}
          containerStyle={[
            styles.searchBarContainer, 
            {marginBottom: 4},
          ]}
          inputContainerStyle={styles.searchBarInput}
          inputStyle={styles.searchBarText}
          placeholderTextColor='#aaa'
          returnKeyType='search'
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={()=> this._doAPISearch()}
          platform='ios'
        />

        <View style={styles.inputView}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, height: 34 }}>
            <SearchOptionsButton 
              icon='md-pin'
              text={this.state.zipCodeText ? this.state.zipCodeText : 'Location'}
              handleTouch={this._setLocationVisible}
              focused={this.state.zipCodeText ? true : false}
              style={{ width: '25%' }}
            />
            <SearchOptionsButton 
              icon='md-person'
              text={this.state.gender ? this.state.gender : 'Gender'}
              handleTouch={this._setGenderVisible}
              focused={this.state.gender ? true : false}
              style={{ width: '25%' }}
            />
            <SearchOptionsButton 
              icon='ios-moon'
              text={this.state.phase ? this.state.phase : 'Phase'}
              handleTouch={this._setPhaseVisible}
              focused={this.state.phase ? true : false}
              style={{ width: '25%' }}
            />

            <View style={{ width: '18%' }}>
              <TouchableOpacity 
              onPress={this._clearFilters} 
              style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={{ color: '#0078ff', fontSize: 16 }}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SearchLocationOptions
          visible={this.state.showLocationOptions}
          setVisible={this._setLocationVisible}
          setLocation={this._setLocation}
          setRadius={this._setRadius}
          searchLocation={this.state.zipCodeText}
          searchRadius={this.state.desiredDistance}
        />

        <SearchGenderOptions
          visible={this.state.showGenderOptions}
          setVisible={this._setGenderVisible}
          setGender={this._setGender}
          gender={this.state.gender}
        />

        <SearchPhaseOptions
          visible={this.state.showPhaseOptions}
          setVisible={this._setPhaseVisible}
          setPhase={this._setPhase}
          phase={this.state.phase}
        />

        {this.state.searchLoading &&
            <View style={styles.searchLoading}>
                <ActivityIndicator size='large' color="#0000ff" />
            </View>
        }


        {!this.state.searchLoading &&
          <ClinicalTrialSearchResults 
            searchDataTotal = {this.state.searchDataTotal} 
            searchDataTrials = {this.state.searchDataTrials}
            searchPageFunction = {() => this._doAPISearch(true)}
            currentPage = {this.state.currentPage}
            searchSize = {this.state.searchSize}
            searchRadius = {Number(this.state.desiredDistance)}
            searchLocation = {this.state.searchLocation ? this.state.searchLocation : this.state.location }/>
        }

      </SafeAreaView>
    );
  }

  _setLocationVisible = visible => {
    this.setState({ showLocationOptions: visible });
  }

  _setLocation = location => {
    this.setState({ zipCodeText: location });
  }

  _setRadius = radius => {
    this.setState({ desiredDistance: radius });
  }

  _setGenderVisible = visible => {
    this.setState({ showGenderOptions: visible });
  }

  _setGender = gender => {
    this.setState({ gender });
  }

  _setPhaseVisible = visible => {
    this.setState({ showPhaseOptions: visible });
  }

  _setPhase = phase => {
    this.setState({ phase });
  }

  _clearFilters = () => {
    this.setState({ zipCodeText: '', gender: '', phase: '', keyWordText: '' });
  }

  _doAPISearch(pageSearch = false, pageDirection = 1, useInclude = true){
    Keyboard.dismiss();
    var params = {};
    if(!pageSearch){
      this.setState({searchLoading: true});
      this.setState({searchDataTotal: null});
      this.setState({searchDataTrials: []});

      this.state.resultsFromIndex = 0;
      this.state.currentPage = 1;

      params[QueryConstants.SIZE_STR] = this.state.searchSize;
      params[QueryConstants.FROM_STR] = this.state.resultsFromIndex;
      params[QueryConstants.CURRENT_TRIAL_STATUS_STR] = this.state.desiredStatus;
      params[QueryConstants.PURPOSE_CODE_STR] = this.state.desiredPurpose;
      
      let genderFilter = ["BOTH"];
      if(this.state.gender === "Male"){
        genderFilter.push("MALE");
      }
      else if(this.state.gender === "Female"){
        genderFilter.push("FEMALE");
      }
      else{
        genderFilter.push("MALE");
        genderFilter.push("FEMALE");
      }

      params[QueryConstants.GENDER_STR] = genderFilter;

      let phaseString = this.state.phase || 'I,II,III,IV';

      let phaseFilter = phaseString.split(",");
      let phaseOptions = QueryConstants.PHASE_OPTION_ARR;

      let addPhase0 = false;
      let addPhase1_2 = false;
      let addPhase2_3 = false;

      for(var p in phaseFilter){
        if(phaseFilter[p] === 'I'){
          addPhase0 = true;
          addPhase1_2 = true;
        }
        if(phaseFilter[p] === 'II'){
          addPhase1_2 = true;
          addPhase2_3 = true;
        }
        if(phaseFilter[p] === 'III'){
          addPhase2_3 = true;
        }
      }

      if(addPhase0){
        phaseFilter.push('O');
      }
      if(addPhase1_2){
        phaseFilter.push('I_II');
      }
      if(addPhase2_3){
        phaseFilter.push('II_III');
      }

      phaseFilter.push(phaseOptions[phaseOptions.length - 1]);

      params[QueryConstants.PHASE_STR] = phaseFilter;

      let keyWordArg = this.state.keyWordText.trim();
      let zipCodeArg = this.state.zipCodeText.trim();

      this.setState({searchLocation: this.state.zipCodeText});

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

    ClinicalTrialAPIUtil.sendPostRequest(params)
    .then((response) => {
        if(response != undefined && response != null){
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
              this.setState({searchDataTotal: response.total});
              this.setState({
                searchDataTrials: [...this.state.searchDataTrials, ...response.trials]});
              this.setState({prevParams: params});
            }
            else{
              //Likely a "from" index was sent higher than was valid 
              this.setState({currentPage: this.state.currentPage - 1});
              this.setState({searchLoading: false});
              this.noMorePages();
            }
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

  setSearchLocation = location => {
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
    let totalPages = Math.ceil(this.props.searchDataTotal / this.props.searchSize);
    return totalPages;
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
    paddingLeft: 15,
    paddingRight: 15,
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
    //justifyContent: "space-between"
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
    marginHorizontal: 7,
    height: 35,
    marginTop: Platform.OS === 'ios' ? 5 : 35,
    marginBottom: 5
  },
  searchBarInput: {
    backgroundColor: '#eee',
    height: 35,
    margin: 0,
    padding: 0,
  },
  searchBarText: {
    color: '#222',
    fontSize: 16
  },
  disabled: {
    opacity: 0.5
  }
});
