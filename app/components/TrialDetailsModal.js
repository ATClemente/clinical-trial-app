import React from 'react';
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
import MapView from 'react-native-maps';
import { Card } from 'react-native-elements';
import axios from 'axios';
import Urls from '../constants/Urls';
import { Ionicons } from '@expo/vector-icons';
import geolib from 'geolib';

export default class TrialDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            trial: {},
            activeSections: [],
            eligibilityCollapsed: true,
            leadOrgCollapsed: true,
            locationsCollapsed: true,
            locationFilter: null,
            locationFilterLat: null,
            locationFilterLon: null,
            genderFilter: null, //true = male
            locationDistanceFilter: null,
            waitForLoading: true
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
        })
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={ false }
                visible={ this.state.modalVisible }
                onRequestClose={() => { this.props.setModalVisible(false) }}>
                <SafeAreaView style={styles.mainView}>
                    <TouchableHighlight onPress = {() => { this.props.setModalVisible(false) }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons 
                          style={{ marginHorizontal: 5 }}
                          size={24}
                          name='ios-arrow-dropleft' />
                        <Text>Back</Text>
                      </View>
                    </TouchableHighlight>
                    <Text style={{fontWeight: "bold", textDecorationLine: "underline", textAlign: "center", marginBottom: 5}}>Trial Details</Text>
                    <View style={{borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 5}}></View>
                    <ScrollView>
                        <Text style={{fontWeight: "bold", textDecorationLine: "underline"}}>Title:</Text>
                        <Text style={{marginBottom: 5}}>{this.state.trial[QueryConstants.BRIEF_TITLE]}</Text>
                        <Text style={{fontWeight: "bold", textDecorationLine: "underline"}}>Trial Summary:</Text>
                        <ViewMoreText
                        numberOfLines={4}
                        renderViewMore={this.renderViewMore}
                        renderViewLess={this.renderViewLess}
                        //textStyle={{textAlign: 'center'}}
                        >
                            <Text>{this.state.trial[QueryConstants.BRIEF_SUMMARY]}</Text>
                        </ViewMoreText>

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

                        <TouchableOpacity onPress={() => {this.setState({leadOrgCollapsed: !this.state.leadOrgCollapsed})}}>
                            <View style={styles.header}>
                            <Text style={styles.headerText}>Lead Organization</Text>
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={this.state.leadOrgCollapsed} align="center">
                            <View style={styles.content}>
                                {!this.isTrialEmpty(this.state.trial) && this.renderLeadOrganization(this.state.trial)}
                            </View>
                        </Collapsible>

                        <TouchableOpacity onPress={() => {this.setState({locationsCollapsed: !this.state.locationsCollapsed})}}>
                            <View style={styles.header}>
                            <Text style={styles.headerText}>Locations</Text>
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={this.state.locationsCollapsed} align="center">
                            <View style={styles.content}>
                                {!this.isTrialEmpty(this.state.trial) && this.renderLocations(this.state.trial)}
                            </View>
                        </Collapsible>

                        <View style={{ alignSelf: 'center', width: '95%', marginTop: 10, zIndex: 1 }}>

                            <GradientButton
                            colors={[Colors.blueOne, Colors.blueTwo]}
                            handleClick={ () => this.saveTrial() }
                            loading={false}
                            text='Save Trial'
                            />
                        </View>

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

    async saveTrial(){
        const token = await AsyncStorage.getItem('jwt');
        const response = await axios.post(
          Urls.server + '/user/trials',
          {
              "trialId": this.state.trial[QueryConstants.NCT_ID]
          },
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if(response.data.success == true){
            Alert.alert(
                'Trial saved',
                'This clinical trial was successfully saved to your account!',
                [
                  {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
              );
        }
        else{
            Alert.alert("There was a problem saving your trial");
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

    renderLocations(trial){

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

    }

    _renderLocationItem = ({item, index}) => {
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
                <Text style={{ color: '#333' }}>{`Status: ${site_status}`}</Text>

                <View style={{ height: 200, width: 280 }}>
                    <MapView
                        style={{ flex: 1 }}
                        liteMode= {true}
                        region={{
                            latitude: site_lat,
                            longitude: site_lon,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        >
                            <MapView.Marker
                                coordinate={{latitude: site_lat,
                                longitude: site_lon}}
                                //title={"title"}
                                //description={"description"}
                            />
                    </MapView>
                </View>

            </View>
          </Card>
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
