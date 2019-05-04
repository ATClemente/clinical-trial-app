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
  Picker,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import GradientButton from '../components/GradientButton';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import ViewMoreText from 'react-native-view-more-text';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import MapView from 'react-native-maps';
import { Card } from 'react-native-elements';
import axios from 'axios';
import Urls from '../constants/Urls';
import { Ionicons } from '@expo/vector-icons';

export default class TrialDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            trial: {},
            activeSections: [],
            eligibilityCollapsed: true,
            leadOrgCollapsed: true,
            locationsCollapsed: true
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
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
            Alert.alert("Trial Saved!");
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


    /*_renderSectionTitle = section => {
        return (
          <View style={styles.content}>
            <Text>Section TITLE</Text>
          </View>
        );
    };*/
    
    /*_renderHeader = section => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{section.title}</Text>
            </View>
        );
    };*/
    
    /*_renderContent = section => {
        //console.log("render Content was called")
        return (
            <View style={styles.content}>
            {this.renderProperSection(section, this.state.trial)}
            </View>
        );
    };*/
    
    /*_updateSections = activeSections => {
        this.setState({ activeSections });
    };*/
    

    /*toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };*/


    /*renderProperSection(section, trial){

        if(section.number === 1){
            //Do something
            return(this.renderEligibilityCriteria(trial));
        }
        else if(section.number === 2){
            return(this.renderLeadOrganization(trial));
        }
        else if(section.number === 3){
            return(this.renderLocations(trial));
        }
    }*/

    renderEligibilityCriteria(trial){
        //console.log("render eligibility criteria called");
        //if(trial == undefined || trial == null || trial[QueryConstants.ELIGIBILITY] == undefined){
        //    return(<Text>No data</Text>);
        //}
        return(
            <FlatList
                data={trial[QueryConstants.ELIGIBILITY][QueryConstants.UNSTRUCTURED]}
                renderItem={this._renderEligibilityItem}
                keyExtractor={(item) => item[QueryConstants.DISPLAY_ORDER].toString()}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                onEndReachedThreshold={0.5}
                //ItemSeparatorComponent={this._renderSeparator} 
            />
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

    renderLeadOrganization(trial){
        return(
            <View>
                <Text style={{fontWeight: "bold"}}>{trial[QueryConstants.LEAD_ORG]}</Text>
                <Text>Principal Investigator: {trial[QueryConstants.PRINCIPAL_INVESTIGATOR]}</Text>
            </View>
        );
    }

    renderLocations(trial){
        /*console.log(trial[QueryConstants.SITES].length)
        var count = 0;
        var sites = trial[QueryConstants.SITES];
        var types = [];
        for (var site in sites){
            //console.log(site);
            if(sites[site][QueryConstants.ORG_STATUS].toLowerCase() == "nullified" || sites[site][QueryConstants.ORG_STATUS].toLowerCase() == "inactive"){
                count++;
            }
            if(types.indexOf(sites[site][QueryConstants.ORG_STATUS].toLowerCase()) === -1){
                types.push(sites[site][QueryConstants.ORG_STATUS].toLowerCase());
            }
        }
        console.log(types);
        console.log("Bad trial sites: " + count.toString());*/
        return(
            <FlatList
                data={trial[QueryConstants.SITES]}
                renderItem={this._renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={true}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                onEndReachedThreshold={0.5}
                //ItemSeparatorComponent={this._renderSeparator} 
            />
        );

    }

    _renderLocationItem = ({item, index}) => {
        const number = (index+1).toString();
        const site_name = item[QueryConstants.ORG_NAME];
        const contact_name = item[QueryConstants.CONTACT_NAME];
        const contact_phone = item[QueryConstants.CONTACT_PHONE];
        const contact_email = item[QueryConstants.CONTACT_EMAIL];
        var site_status = item[QueryConstants.ORG_STATUS].toLowerCase();
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

                <View style={{ height: 200, width: 200 }}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: site_lat,
                            longitude: site_lon,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        >
                    </MapView>
                </View>

            </View>
          </Card>
        );
    }

    isTrialEmpty(trial){
        for (var key in trial) {
            if (trial[key] !== null && trial[key] != "")
                return false;
        }
        return true;   
    }

    


}


const SECTIONS = [
    {
      title: 'Eligibility Criteria',
      number: 1,
      content: ""
    },
    {
      title: 'Lead Organization',
      number: 2,
      content: ""
    },
    {
      title: 'Locations',
      number: 3,
      content: ""
    }
  ];

  

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
  }
});

var myLat = 35.9995;
var myLong = -78.94;

var markers = [{
  key: 1,
  title: "hello1",
  coordinates: {
      latitude: myLat,
      longitude: myLong
    },
  },{
    key: 2,
    title: "hello2",
    coordinates: {
      latitude: myLat + 3,
      longitude: myLong + 3
    }
  },{
    key: 3,
    title: "hello3",
    coordinates: {
      latitude: myLat + 5,
      longitude: myLong + 5
    }
}]
