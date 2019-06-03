import React from 'reactn';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Modal,
  AsyncStorage
} from 'react-native';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ViewMoreText from 'react-native-view-more-text';
import MapView, {Circle, Callout} from 'react-native-maps';
import { Card } from 'react-native-elements';
import axios from 'axios';
import Urls from '../constants/Urls';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../components/IconButton';
import geolib from 'geolib';

export default class TrialDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            trial: {},
            activeSections: [],
            eligibilityCollapsed: true,
            inclusionCriteria: [],
            exclusionCriteria: [],
            showMoreEligibility: false,
            leadOrgCollapsed: true,
            mapCollapsed: true,
            locationFilter: null,
            locationFilterLat: null,
            locationFilterLon: null,
            locationMarkers: [],
            genderFilter: null, //true = male
            locationDistanceFilter: null,
            waitForLoading: true,
            savedTrials: this.global.trials,
            trialSaved: false,
            modifyTrial: false,
            activeMarkerOpacity: 1,
            temporaryMarkerOpacity: 1,
            closedMarkerOpacity: 1,
        };
        this.selectedMarker = null;
        this.selectedMarkerType = '';
        this.markers={};
    }

    componentWillReceiveProps(nextProps) {
        this.setUserLocationCoordinates(nextProps.searchLocation);
        this.setState({
            locationDistanceFilter: nextProps.searchRadius,
            modalVisible: nextProps.modalVisible,
            trial: nextProps.trial
        });
        let savedTrials = this.global.trials;
        let result = savedTrials.filter(e => e.trial_id === nextProps.trial[QueryConstants.NCT_ID]);
        this.setState({ trialSaved: result.length ? true : false });
        this.separateEligibilityCriteria(nextProps.trial);
    }

    resetModal(){
        //this.props.setModalVisible(false);
        this.markers = {};
        this.selectedMarker = null;
        this.selectedMarkerType = '';
        this.setState({
            showMoreEligibility: false,
            activeMarkerOpacity: 1,
            temporaryMarkerOpacity: 1,
            closedMarkerOpacity: 1,
            waitForLoading: true}, 
            function(){
            this.props.setModalVisible(false);
        });
    }

    render() {
        return (
            <Modal
                animationType='slide'
                transparent={ false }
                visible={ this.state.modalVisible }
                onRequestClose={() => { this.resetModal() }}>
                <SafeAreaView style={styles.mainView}>

                    <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{width: '25%', }}>
                            <IconButton
                                icon='ios-arrow-dropleft'
                                side='left'
                                text='Back'
                                handleTouch={() => { this.resetModal() }}
                            />
                        </View>

                        <Text style={{fontWeight: "bold", textDecorationLine: "underline", textAlign: "center" }}>Trial Details</Text>

                        <View style={{width: '25%', alignItems: 'flex-end' }}>
                            <IconButton
                                icon={this.state.trialSaved ? 'md-star' : 'md-star-outline'}
                                iconSize={26}
                                side='right'
                                text={this.state.trialSaved ? 'Unsave' : 'Save' }
                                textColor='#333'
                                iconColor='#f2c100'
                                handleTouch={this.state.trialSaved ? this.unsaveTrial : this.saveTrial }
                            />
                        </View>
                    </View>
                    
                    <View style={{borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 5}}></View>
                    <ScrollView>
                        <Text style={{fontWeight: "bold", textDecorationLine: "underline"}}>Title:</Text>
                        <Text style={{marginBottom: 5}}>{this.state.trial[QueryConstants.BRIEF_TITLE]}</Text>
                        <Text style={{fontWeight: "bold", textDecorationLine: "underline"}}>Trial Summary:</Text>
                        <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={this.renderViewMore}
                        renderViewLess={this.renderViewLess}
                        //textStyle={{textAlign: 'center'}}
                        >
                            <Text>{this.state.trial[QueryConstants.BRIEF_SUMMARY]}</Text>
                        </ViewMoreText>

                        <Text style={{fontWeight: "bold", textDecorationLine: "underline"}}>Lead Organization:</Text>
                        <View style={{padding: 10, alignItems: "center"}}>
                                {!this.isTrialEmpty(this.state.trial) && this.renderLeadOrganization(this.state.trial)}
                        </View>

                        <Text style={{padding: 5, textAlign: "center"}}>Sites within {this.state.locationDistanceFilter} miles of {this.props.searchLocation}: </Text>
                        
                        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                            <Ionicons onPress={() => {
                                    this.setState({activeMarkerOpacity: +!this.state.activeMarkerOpacity}); 
                                    if(this.selectedMarker != null && this.selectedMarkerType === 'active'){
                                        this.markers[this.selectedMarker].hideCallout()
                                    }
                                }} name="md-pin" size={32} color="#00FF00"/>
                            <Text style={{paddingTop: 5}}> = Active  </Text>
                            <Ionicons onPress={() => {
                                    this.setState({temporaryMarkerOpacity: +!this.state.temporaryMarkerOpacity});
                                    if(this.selectedMarker != null && this.selectedMarkerType === 'temp'){
                                        this.markers[this.selectedMarker].hideCallout()
                                    }
                                }} name="md-pin" size={32} color="#FFFF00"/>
                            <Text style={{paddingTop: 5}}> = Temporarily Closed  </Text>
                            <Ionicons onPress={() => {
                                    this.setState({closedMarkerOpacity: +!this.state.closedMarkerOpacity})
                                    if(this.selectedMarker != null && this.selectedMarkerType === 'closed'){
                                        this.markers[this.selectedMarker].hideCallout()
                                    }
                                }} name="md-pin" size={32} color="#FF0000"/>
                            <Text style={{paddingTop: 5}}> = Closed  </Text>
                        </View>

                        <View /*style={styles.content}*/>
                                {!this.isTrialEmpty(this.state.trial) && this.renderMapview(this.state.trial)}
                        </View>

                        <Text style={{marginTop: 10, fontWeight: "bold", textDecorationLine: "underline"}}>Eligibility Criteria:</Text>
                        <View style={{padding: 10, alignItems: "center"}}>
                                {!this.isTrialEmpty(this.state.trial) && this.renderEligibilityCriteria(this.state.trial)}
                        </View>

                    </ScrollView>
                </SafeAreaView>

                {this.state.waitForLoading &&
                    <View style={styles.profileLoading}>
                        <ActivityIndicator size='large' color="#0000ff" />
                    </View>
                }

            </Modal>
        )
    }

    saveTrial = async () => {
        try {
            this.setState({ modifyTrial: true });
            const { data } = await axios.post(
                Urls.server + '/user/trials',
                {
                    trialId: this.state.trial[QueryConstants.NCT_ID],
                },
                {
                  headers: {
                    Authorization: this.global.token,
                    'Content-Type': 'application/json'
                  }
                }
              );
            this.setState({ trialSaved: true });
            this.setGlobal({ trials: data.savedTrials });
            await AsyncStorage.setItem('trials', JSON.stringify(data.savedTrials));
            this.setState({ modifyTrial: false });
        } catch (e) {
            console.log(e);
            if (e.response) {
                Alert.alert(e.response.data.status);
            } else {
                Alert.alert('There was a problem saving your trial');
            }
        }
    }

    unsaveTrial = async () => {
        try {
            this.setState({ modifyTrial: true });
            const response = await axios.delete(
                Urls.server + '/user/trials/' + this.state.trial[QueryConstants.NCT_ID],
                {
                  headers: {
                    Authorization: this.global.token,
                    'Content-Type': 'application/json'
                  }
                }
              );
            // Alert.alert('Trial removed from list');
            this.setState({ trialSaved: false });
            const allTrials = this.global.trials;
            const updatedTrials = allTrials.filter(e => e.trial_id !== this.state.trial[QueryConstants.NCT_ID]);
            this.setGlobal({ trials: updatedTrials });
            await AsyncStorage.setItem('trials', JSON.stringify(updatedTrials));
            this.setState({ modifyTrial: false });
            if (this.props.savedScreen) {
                this.props.setModalVisible(false);
            }
        } catch (e) {
            console.log(e);
            if (e.response) {
                Alert.alert(e.response.data.status);
            } else {
                Alert.alert('There was a problem deleting this trial from saved list');
            }
        }
    }

    applyToTrial(){

    }

    renderViewMore(onPress){
        return(
          <Text style={{color: "blue"}} onPress={onPress}>View more</Text>
        )
      }

    renderViewLess(onPress){
        return(
            <Text style={{color: "blue"}} onPress={onPress}>View less</Text>
        )
    }


    separateEligibilityCriteria(trial){

        if(this.isTrialEmpty(trial)){
            return;
        }
        var currInclusionCriteria = [];

        var currExclusionCriteria = [];

        var allCriteria = trial[QueryConstants.ELIGIBILITY][QueryConstants.UNSTRUCTURED];

        for(var i = 0; i < allCriteria.length; i++){
            if(allCriteria[i][QueryConstants.INCLUSION_INDICATOR] == true){
                currInclusionCriteria.push(allCriteria[i]);
            }
            else{
                currExclusionCriteria.push(allCriteria[i]);
            }
        }

        this.setState({inclusionCriteria: currInclusionCriteria});
        this.setState({exclusionCriteria: currExclusionCriteria});
    }

    setCriteriaToggleText(){
        if(!this.state.showMoreEligibility){
            return "Show More Criteria";
        }
        else{
            return "Show Less Criteria";
        }
    }

    renderEligibilityCriteria(trial){

        let inclToDisplay = [];
        let exclToDisplay = [];

        if(!this.state.showMoreEligibility){
            inclToDisplay = this.state.inclusionCriteria.slice(0, 5);
            exclToDisplay = this.state.exclusionCriteria.slice(0, 5);
        }
        else{
            inclToDisplay = this.state.inclusionCriteria;
            exclToDisplay = this.state.exclusionCriteria;
        }

        return(
            <View style={{flex:1}}>
                <Text>Inclusion Criteria:</Text>
                <FlatList
                    data={inclToDisplay}
                    renderItem={this._renderEligibilityItem}
                    keyExtractor={(item) => item[QueryConstants.DISPLAY_ORDER].toString()}
                    ListEmptyComponent={this.noInclusionCriteria}
                />
                <Text style={{marginTop: 10}}>Exclusion Criteria:</Text>
                <FlatList
                    data={exclToDisplay}
                    renderItem={this._renderEligibilityItem}
                    keyExtractor={(item) => item[QueryConstants.DISPLAY_ORDER].toString()}
                    ListEmptyComponent={this.noExlusionCriteria}
                    ListFooterComponent={this._renderCriteriaToggle} 
                />
            </View>
        );
    }

    _renderEligibilityItem = ({item, index}) => {
        const number = (index+1).toString();
        const description = item[QueryConstants.DESCRIPTION];
        return(
          <Card
            containerStyle={{ padding: 0, borderRadius: 5 }}
            wrapperStyle={{ 
                padding: 10, 
                backgroundColor: item[QueryConstants.INCLUSION_INDICATOR] ? "#e8ffe8" : "#ffe8e8" 
            }}
          >
            <View>
                <ViewMoreText
                numberOfLines={2}
                renderViewMore={this.renderViewMore}
                renderViewLess={this.renderViewLess}
                >
                    <Text style={{ color: '#333' }}>{`${number}. ${description}`}</Text>
                </ViewMoreText>
            </View>

          </Card>
        );
    
    };

    _renderCriteriaToggle = () => {
        return(
            <TouchableOpacity 
                style={{ backgroundColor: '#e8efff', borderColor: '#b9ccea', borderWidth: 1, borderRadius: 4, marginTop: 8 }}
                onPress={() => this.setState({showMoreEligibility: !this.state.showMoreEligibility})}>
                <Text style={{ color: '#324e7a', alignSelf: 'center', paddingVertical: 6 }}>{this.setCriteriaToggleText()}</Text>
            </TouchableOpacity>
        );
    }

    noInclusionCriteria(){
        return(
            <Text style={{fontWeight: "bold"}}>This trial has no inclusion criteria</Text>
        );
    }

    noExlusionCriteria(){
        return(
            <Text style={{fontWeight: "bold"}}>This trial has no exclusion criteria</Text>
        );
    }

    renderLeadOrganization(trial){
        return(
            <View>
                <Text style={{fontWeight: "bold"}}>{this.getLeadOrg(trial)}</Text>
                <Text>Principal Investigator: {this.getPrincipalInvestigator(trial)}</Text>
            </View>
        );
    }

    getLeadOrg(trial){
        if(trial[QueryConstants.LEAD_ORG]){
            return trial[QueryConstants.LEAD_ORG];
        }
        else{
            return "No lead organization specified";
        }
    }

    getPrincipalInvestigator(trial){
        if(trial[QueryConstants.PRINCIPAL_INVESTIGATOR]){
            return trial[QueryConstants.PRINCIPAL_INVESTIGATOR];
        }
        else{
            return "No principal investigator specified";
        }
    }
    
    clearLoadingIndicator = () => {
        console.log("clear loading called");
        this.setState({waitForLoading: false});
    }


    renderMapview = (trial) => {

        //var activeSites = trial[QueryConstants.SITES].filter(this.checkForActiveSites);
        //var finalSites = activeSites.filter(this.checkForLocationProximity);

        let finalSites = trial[QueryConstants.SITES].filter(this.checkForLocationProximity);

        if (finalSites.length < 1){
            return(
                <View
                    style={{justifyContent: 'center'}} 
                    onLayout={() => {this.setState({waitForLoading: false })}} >
                    <Text style={{ textAlign: "center" }}>Whoops!</Text>
                    <Text style={{ textAlign: "center" }}>There are no trial sites near you :(</Text>
                    <Text style={{ textAlign: "center" }}>Try searching again with a specific location</Text>
                    <Text style={{ textAlign: "center" }}>to find trials with sites close to you!</Text>
                </View>
            );

        }

        var locationMarkers = [];

        for(var i = 0; i < finalSites.length; i++){
            var currentSite = finalSites[i];
            var newMarker = {};
            var site_lat;
            var site_lon;
            
            if(currentSite[QueryConstants.ORG_CORRDINATES] && currentSite[QueryConstants.ORG_CORRDINATES][QueryConstants.LAT] && currentSite[QueryConstants.ORG_CORRDINATES][QueryConstants.LON]){

                site_lat = currentSite[QueryConstants.ORG_CORRDINATES][QueryConstants.LAT];
                site_lon = currentSite[QueryConstants.ORG_CORRDINATES][QueryConstants.LON];

                newMarker.key = i + 1;
                newMarker.coordinates = {};
                newMarker.coordinates.latitude = site_lat;
                newMarker.coordinates.longitude = site_lon;
    
                newMarker.title = currentSite[QueryConstants.ORG_NAME];
    
                if(currentSite[QueryConstants.CONTACT_NAME] != null){
                    newMarker.contact_name = currentSite[QueryConstants.CONTACT_NAME];
                }
                else{
                    newMarker.contact_name = "None Provided";
                }
    
                if(currentSite[QueryConstants.CONTACT_PHONE] != null){
                    newMarker.contact_phone = currentSite[QueryConstants.CONTACT_PHONE];
                }
                else{
                    newMarker.contact_phone = "None Provided";
                }
    
                if(currentSite[QueryConstants.CONTACT_EMAIL] != null){
                    newMarker.contact_email = currentSite[QueryConstants.CONTACT_EMAIL];
                }
                else{
                    newMarker.contact_email = "None Provided";
                }

                //Set pin color (.pinColor)
                //Colors use HSV and from what I have seen and found can be any "HUE" but need 100% value and saturation.
                //Using named colors for now and converted to hex so we can know what that is
                if(currentSite[QueryConstants.RECRUIT_STATUS].toLowerCase() == "active"){
                    newMarker.pinColor = 'green'; //#00FF00
                    newMarker.type = 'active';
                    newMarker.opacity = this.state.activeMarkerOpacity;
                }
                else if(currentSite[QueryConstants.RECRUIT_STATUS].toLowerCase() == "temporarily_closed_to_accrual"){
                    newMarker.pinColor = 'yellow'; //#FFFF00
                    newMarker.type = 'temp';
                    newMarker.opacity = this.state.temporaryMarkerOpacity;
                }
                else if(currentSite[QueryConstants.RECRUIT_STATUS].toLowerCase() == "closed_to_accrual"){
                    newMarker.pinColor = 'red'; //#FF0000
                    newMarker.type = 'closed';
                    newMarker.opacity = this.state.closedMarkerOpacity;
                }
    
                locationMarkers.push(newMarker);
            }
        
            
        }

        /*var centerMarker = {};

        centerMarker.key = 0;
        centerMarker.coordinates = {};
        centerMarker.coordinates.latitude = this.state.locationFilterLat;
        centerMarker.coordinates.longitude = this.state.locationFilterLon;
        centerMarker.pinColor = "blue";
        centerMarker.title = "Your location";*/

        //locationMarkers.push(centerMarker);

        var latDelta, lonDelta;

        latDelta = 0.32 * (this.state.locationDistanceFilter / 10);
        lonDelta = 0.12 * (this.state.locationDistanceFilter / 10);

        return(
            <View style={{ height: 320, width: 370 }}>
                <MapView
                    style={{ flex: 1 }}
                    onMapReady = {() => {this.setState({waitForLoading: false })}}
                    initialRegion={{
                        latitude: this.state.locationFilterLat,
                        longitude: this.state.locationFilterLon,
                        //latitudeDelta: 0.0922,
                        //longitudeDelta: 0.0421,
                        latitudeDelta: latDelta,
                        longitudeDelta: lonDelta,
                    }}
                    >
                    <Circle
                        center={{
                            latitude: this.state.locationFilterLat,
                            longitude: this.state.locationFilterLon
                        }}
                        radius={this.state.locationDistanceFilter * 1609.344 * 1.05}
                        fillColor="rgba(255, 0, 0, 0.2)"
                        strokeColor="rgba(0,0,0,0.5)"
                        zIndex={2}
                        strokeWidth={2}
                    />
                    {locationMarkers.map(marker => (
                        <MapView.Marker
                        //title={marker.title}
                        //description={marker.description}
                        coordinate={marker.coordinates}
                        pinColor={marker.pinColor}
                        key = {marker.key}
                        opacity={marker.opacity}
                        ref={(ref) => this.markers[marker.key] = ref}
                        onPress={() => {this.selectedMarker = marker.key; this.selectedMarkerType = marker.type}}
                        >
                        <Callout style={styles.plainView} tooltip={!!!marker.opacity}>
                            {!!marker.opacity && this.renderCallout(marker, !!marker.opacity)}
                        </Callout>
                        </MapView.Marker>
                    ))} 
                </MapView>
            </View>
        );
    }

    renderCallout(marker, show){
        if(show){
            return(
                <View style={{margin: 5}} >
                    <Text style={{fontWeight: "bold"}}>{marker.title}</Text>
                    <Text>Contact Name: {marker.contact_name}</Text>
                    <Text>Contact Phone: {marker.contact_phone}</Text>
                    <Text>Contact Email: {marker.contact_email}</Text>
                </View>
            );
        }
        else{
            markerRef.hideCallout();
            return null;
        }
    }

    checkForActiveSites(site){

        return site[QueryConstants.RECRUIT_STATUS].toLowerCase() == "active";
    }

    async setUserLocationCoordinates(zipInput){

        try {
            const response = await fetch('https://gist.githubusercontent.com/erichurst/7882666/raw/5bdc46db47d9515269ab12ed6fb2850377fd869e/US%2520Zip%2520Codes%2520from%25202013%2520Government%2520Data', {
              method: 'GET'
            });

            await response.text().then(function (text) {
                zipCoordData = text;
              });

            //var searchstring = "\n" + this.state.locationFilter + ","; 
            var searchstring = "\n" + zipInput + ",";
            var searchForZip = zipCoordData.indexOf(searchstring);

            if (searchForZip != -1) {
              var firstCoordStart = searchForZip + 7;
              var firstCoordEnd = firstCoordStart + 9;
              var secondCoordStart = firstCoordEnd + 1;
              var secondCoordEnd = secondCoordStart + 10;
              var latString = zipCoordData.slice(firstCoordStart, firstCoordEnd);
              var longString = zipCoordData.slice(secondCoordStart, secondCoordEnd);
              this.setState({locationFilterLat: geolib.useDecimal(latString)});
              this.setState({locationFilterLon: geolib.useDecimal(longString)});
            } else { 
              var coordinates = []; 
              coordinates.latitude = 0;
              coordinates.longitude = 0;
              this.setState({locationFilterLat: geolib.useDecimal(0)});
              this.setState({locationFilterLon: geolib.useDecimal(0)});
            }
        } catch (err) {
            console.error(err);
        }
    }

    checkForLocationProximity = (site) => {
        try{
            var siteCoords = {};

            siteCoords.latitude = geolib.useDecimal(site[QueryConstants.ORG_CORRDINATES][QueryConstants.LAT]);
            siteCoords.longitude = geolib.useDecimal(site[QueryConstants.ORG_CORRDINATES][QueryConstants.LON]);
    
            if(siteCoords.latitude == 0 || siteCoords.longitude == 0){
                return false;
            }
            //This works:
            return (geolib.getDistance(
               {latitude: this.state.locationFilterLat, longitude: this.state.locationFilterLon}, 
               {latitude: siteCoords.latitude, longitude: siteCoords.longitude}, 10, 1) / 1609.344) <= (this.state.locationDistanceFilter * 1.05); 
        }
        catch(e){
            return false;
        }
    }


    setProfileData = () =>{
        this.setState({ waitForLoading: true });
        AsyncStorage.getItem('profile')
        .then(res => JSON.parse(res))
        .then(profile => {
          this.setState( { genderFilter: profile.gender, locationFilter: profile.location })
          this.setState({ waitForLoading: false });
          console.log(profile);
        });
    }

    isTrialEmpty(trial){
        for (var key in trial) {
            if (trial[key] !== null && trial[key] != "")
                return false;
        }
        return true;   
    }
}
  

const styles = StyleSheet.create({
  mainView:{
      padding: 20,
      flex: 1
  },
  allResultsView:{
    //padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom:20,
    flex: 1
  },
  noResultsView:{
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  itemView1: {
    backgroundColor: "#fcfdff",
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  itemView2: {
    backgroundColor: "#D3D3D3",
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  pageIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  titleText:{
    color: "#409ae0",
    textDecorationLine: 'underline'
  },
  header: {
    backgroundColor: '#c9eeff',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth
  },
  profileLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10 //Part of said hack
  }
});
