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
  Modal
} from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import TrialDetailsModal from '../components/TrialDetailsModal';
import TrialCard from '../components/TrialCard';

export default class ClinicalTrialSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayTrialDetails: false,
        currentTrial: {}
    };
  }

  render() {
    if(this.props.searchDataTotal == undefined || this.props.searchDataTotal == 0){
      return (
        <View style={styles.noResultsView}>
          <Text>No results yet.</Text>
          <Text>Run a search for clinical trials and see what's out there :)</Text> 
        </View>
      );
    }
    else{
      return (
          <View style={styles.allResultsView}>
            <FlatList
              data={this.props.searchDataTrials}
              renderItem={this._renderItem}
              keyExtractor={(item) => item[QueryConstants.NCT_ID]}
              ListFooterComponent={this._renderFooter}
              onEndReached={this._renderMoreResults}
            />
            <TrialDetailsModal
              modalVisible = { this.state.displayTrialDetails }
              setModalVisible = { (vis) => { this.setModalVisible(vis) }}
              searchRadius = {this.props.searchRadius}
              trial = { this.state.currentTrial }
              viewTrial = {this.setUpModal}
          />
          </View>
      );
    }
  }

  _renderItem = ({item, index}) => {
    //const number = (index+(1 + this.props.searchDataTrials.length * ( this.props.currentPage - 1 ))).toString();
    const number = (index + 1).toString();
    const trialText = item[QueryConstants.BRIEF_TITLE];
    const ViewTrialButton = (
      <TouchableOpacity 
        style={{ backgroundColor: '#e8efff', borderColor: '#b9ccea', borderWidth: 1, borderRadius: 4, marginTop: 8 }}
        onPress={() => this.setUpModal(item)}>
        <Text style={{ color: '#324e7a', alignSelf: 'center', paddingVertical: 6 }}>View Trial</Text>
      </TouchableOpacity>
    );
    return(
      <TrialCard 
        item={item} 
        title={`${number}. ${trialText}`} 
        ViewTrialButton={ViewTrialButton}
      />
    );
  };

  setUpModal = item => {
      this.setState({
        displayTrialDetails: true,
        currentTrial: item
    });
  }

  setModalVisible(visible) {
    this.setState({displayTrialDetails: visible});
  }


  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#000000"
          //backgroundColor: "#CED0CE",
          //marginLeft: "14%"
        }}
      />
    );
  };

  _renderFooter = () => {
    if (this.props.currentPage >= Math.ceil(this.props.searchDataTotal / this.props.searchSize)) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          //borderTopWidth: 1,
          //borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator size='large' color="#0000ff" />
      </View>
    );
  }

  _renderMoreResults = () => {
    if(this.props.currentPage < Math.ceil(this.props.searchDataTotal / this.props.searchSize)){
      this.props.searchPageFunction();
    }  
  
  }

  // _getTotalPageCount = () => {
  //   let totalPages = Math.ceil(this.props.searchData.total / this.props.searchSize);
  //   return totalPages.toString();
  // }


}

const styles = StyleSheet.create({ 
  allResultsView:{
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
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
    // color: "#409ae0",
    // textDecorationLine: 'underline'
  }
});
