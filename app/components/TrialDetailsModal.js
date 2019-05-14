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
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import Colors from '../constants/Colors';
import GradientButton from '../components/GradientButton';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ViewMoreText from 'react-native-view-more-text';
import Collapsible from 'react-native-collapsible';
import MapView, {Circle, Callout} from 'react-native-maps';
import { Card } from 'react-native-elements';
import axios from 'axios';
import Urls from '../constants/Urls';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../components/IconButton';
import geolib from 'geolib';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';

export default class TrialDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            trial: {},
            activeSections: [],
            eligibilityCollapsed: true,
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
            modifyTrial: false
        };
    }

    componentWillMount(){
        this.setProfileData();
        this.setUserLocationCoordinates();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            locationDistanceFilter: nextProps.searchRadius,
            modalVisible: nextProps.modalVisible,
            trial: nextProps.trial
        });
        let savedTrials = this.global.trials;
        let result = savedTrials.filter(e => e.trial_id === nextProps.trial[QueryConstants.NCT_ID]);
        this.setState({ trialSaved: result.length ? true : false });
    }

    render() {
        return (
            <Modal
                animationType='slide'
                transparent={ false }
                visible={ this.state.modalVisible }
                onRequestClose={() => { this.props.setModalVisible(false) }}>
                <SafeAreaView style={styles.mainView}>

                    <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{width: '25%', }}>
                            <IconButton
                                icon='ios-arrow-dropleft'
                                side='left'
                                text='Back'
                                handleTouch={() => this.props.setModalVisible(false)}
                            />
                        </View>

                        <Text style={{fontWeight: "bold", textDecorationLine: "underline", textAlign: "center" }}>Trial Details</Text>

                        <View style={{width: '25%', alignItems: 'flex-end' }}>
                            <IconButton
                                style={{ marginRight: 3 }}
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

                        <Text style={{padding: 5, textAlign: "center"}}>Sites within {this.state.locationDistanceFilter} miles of {this.state.locationFilter}: </Text>

                        <View /*style={styles.content}*/>
                                {!this.isTrialEmpty(this.state.trial) && this.renderMapview(this.state.trial)}
                        </View>


                        <TouchableOpacity onPress={() => {this.setState({eligibilityCollapsed: !this.state.eligibilityCollapsed})}}>
                            <View style={styles.header}>
                            <Text style={styles.headerText}>Eligibility Criteria</Text>
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={this.state.eligibilityCollapsed} align="center">
                            <View style={styles.content}>
                                {!this.isTrialEmpty(this.state.trial) && this.renderEligibilityCriteria(this.state.trial)}
                            </View>
                        </Collapsible>

                        {this.state.waitForLoading &&
                            <View style={styles.profileLoading}>
                                <ActivityIndicator size='large' color="#0000ff" />
                            </View>
                        }

                    </ScrollView>
                </SafeAreaView>
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




    renderEligibilityCriteria(trial){

        var inclusionCriteria = [];

        var exclusionCriteria = [];

        var allCriteria = trial[QueryConstants.ELIGIBILITY][QueryConstants.UNSTRUCTURED];

        for(var i = 0; i < allCriteria.length; i++){
            if(allCriteria[i][QueryConstants.INCLUSION_INDICATOR] == true){
                inclusionCriteria.push(allCriteria[i]);
            }
            else{
                exclusionCriteria.push(allCriteria[i]);
            }
        }

        return(
            <View>
                <Text>Inclusion Criteria:</Text>
                <FlatList
                    data={inclusionCriteria}
                    renderItem={this._renderEligibilityItem}
                    keyExtractor={(item) => item[QueryConstants.DISPLAY_ORDER].toString()}
                    ListEmptyComponent={this.noInclusionCriteria}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    onEndReachedThreshold={0.5}
                    //ItemSeparatorComponent={this._renderSeparator} 
                />
                <Text style={{marginTop: 10}}>Exclusion Criteria:</Text>
                <FlatList
                    data={exclusionCriteria}
                    renderItem={this._renderEligibilityItem}
                    keyExtractor={(item) => item[QueryConstants.DISPLAY_ORDER].toString()}
                    ListEmptyComponent={this.noExlusionCriteria}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    onEndReachedThreshold={0.5}
                    //ItemSeparatorComponent={this._renderSeparator} 
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
            wrapperStyle={{ padding: 10 }}
          >
            <View>
              <Text style={{ color: '#333' }}>{`${number}. ${description}`}</Text>
            </View>
          </Card>
        );
    
    };

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

    /*renderLocations(trial){

        var activeSites = trial[QueryConstants.SITES].filter(this.checkForActiveSites);
        var finalSites = activeSites.filter(this.checkForLocationProximity);
        return(
            <View>
                <Text>Locations within {this.state.locationDistanceFilter} miles of {this.state.locationFilter}: </Text>
                <FlatList
                    data={finalSites}
                    renderItem={this._renderLocationItem}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={true}
                    //initialNumToRender={10}
                    //maxToRenderPerBatch={5}
                    //windowSize={5}
                    //onEndReachedThreshold={0.5}
                    //ItemSeparatorComponent={this._renderSeparator} 
                />
            </View>
        );

    }*/

    /*_renderLocationItem = ({item, index}) => {
        const number = (index+1).toString();
        const site_name = item[QueryConstants.ORG_NAME];
        const contact_name = item[QueryConstants.CONTACT_NAME];
        const contact_phone = item[QueryConstants.CONTACT_PHONE];
        const contact_email = item[QueryConstants.CONTACT_EMAIL];
        var site_status = item[QueryConstants.RECRUIT_STATUS].toLowerCase();
        site_status = site_status.charAt(0).toUpperCase() + site_status.slice(1);
        var site_lat;
        var site_lon;
        if(item[QueryConstants.ORG_CORRDINATES] == undefined){
            site_lat = 0;
            site_lon = 0;
        }
        else{
            site_lat = item[QueryConstants.ORG_CORRDINATES][QueryConstants.LAT];
            site_lon = item[QueryConstants.ORG_CORRDINATES][QueryConstants.LON];
        }

        if(site_lat == undefined || site_lon == undefined){
            site_lat = 0;
            site_lon = 0;
        }

        return(
          <Card
            containerStyle={{ padding: 0, borderRadius: 5 }}
            wrapperStyle={{ padding: 10 }}
          >
            <View>
                <Text style={{ color: '#333', fontWeight: "bold"}}>{`${number}. ${site_name}`}</Text>
                <Text style={{ color: '#333' }}>{`Contact Name: ${contact_name}`}</Text>
                <Text style={{ color: '#333' }}>{`Contact Phone: ${contact_phone}`}</Text>
                <Text style={{ color: '#333' }}>{`Contact Email: ${contact_email}`}</Text>
            </View>
          </Card>
        );
    }*/

    renderMapview = (trial) => {

        var activeSites = trial[QueryConstants.SITES].filter(this.checkForActiveSites);
        var finalSites = activeSites.filter(this.checkForLocationProximity);

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
            <View style={{ height: 300, width: 370 }}>
                <MapView
                    style={{ flex: 1 }}
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
                        >
                        <Callout style={styles.plainView}>
                            <View style={{margin: 5}} >
                                <Text style={{fontWeight: "bold"}}>{marker.title}</Text>
                                <Text>Contact Name: {marker.contact_name}</Text>
                                <Text>Contact Phone: {marker.contact_phone}</Text>
                                <Text>Contact Email: {marker.contact_email}</Text>
                            </View>
                        </Callout>
                        </MapView.Marker>
                    ))}
                </MapView>
            </View>
        );
    }

    checkForActiveSites(site){

        return site[QueryConstants.RECRUIT_STATUS].toLowerCase() == "active";
    }

    async setUserLocationCoordinates(){

        try {
            const response = await fetch('https://gist.githubusercontent.com/erichurst/7882666/raw/5bdc46db47d9515269ab12ed6fb2850377fd869e/US%2520Zip%2520Codes%2520from%25202013%2520Government%2520Data', {
              method: 'GET'
            });

            await response.text().then(function (text) {
                zipCoordData = text;
              });

            var searchstring = "\n" + this.state.locationFilter + ","; 
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
    opacity: 0.80,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10 //Part of said hack
  }
});
