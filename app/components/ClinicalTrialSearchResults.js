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
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import TrialDetailsModal from '../components/TrialDetailsModal';

export default class ClinicalTrialSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        displayTrialDetails: false,
        currentTrial: {}
    };
  }

  render() {
    if(this.props.searchData.total == undefined || this.props.searchData.total == 0){
        return (
          <View style={styles.noResultsView}>
            <Text>No results yet.</Text>
            <Text>Run a search and see what's out there :)</Text> 
          </View>
        );
    }
    else{
        return (
            <View style={styles.allResultsView}>
              <View style={styles.pageIndicator}>
                <Text>Page {this.props.currentPage.toString()} of {this._getTotalPageCount()}</Text>
              </View>
              <TrialDetailsModal
                modalVisible = { this.state.displayTrialDetails }
                setModalVisible = { (vis) => { this.setModalVisible(vis) }}
                trial = { this.state.currentTrial }
            />
              <FlatList
                  data={this.props.searchData.trials}
                  renderItem={this._renderItem}
                  keyExtractor={(item) => item[QueryConstants.NCT_ID]}
                  ItemSeparatorComponent={this._renderSeparator} 
              />
            </View>
        );
    }
  }

  _renderItem = ({item, index}) => {
    if(index % 2 == 0){
      return(
        <View style = {styles.itemView1}>
          <TouchableOpacity onPress={() => {this.setUpModal(item)}}>
              <Text style={styles.titleText}>{(index+(1 + this.props.searchData.trials.length * ( this.props.currentPage - 1 ))).toString()}. {item[QueryConstants.BRIEF_TITLE]}</Text>
          </TouchableOpacity>
          <Text>Phase: {ClinicalTrialAPIUtil.getPhase(item)}</Text>
          <Text>Age: {ClinicalTrialAPIUtil.getAgeRestrictions(item)}</Text>
          <Text>Gender: {ClinicalTrialAPIUtil.getGenderRestrictions(item)}</Text>
        </View>
      );
    }
    else{
      return(
        <View style = {styles.itemView2}>
          <TouchableOpacity onPress={() => {this.setUpModal(item)}}>
              <Text style={styles.titleText}>{(index+(1 + this.props.searchData.trials.length * ( this.props.currentPage - 1 ))).toString()}. {item[QueryConstants.BRIEF_TITLE]}</Text>
          </TouchableOpacity>
          <Text>Phase: {ClinicalTrialAPIUtil.getPhase(item)}</Text>
          <Text>Age: {ClinicalTrialAPIUtil.getAgeRestrictions(item)}</Text>
          <Text>Gender: {ClinicalTrialAPIUtil.getGenderRestrictions(item)}</Text>
        </View>
      );
    }

  };

  setUpModal = (item) => {
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

  _getTotalPageCount = () => {
    let totalPages = Math.ceil(this.props.searchData.total / this.props.searchSize);
    return totalPages.toString();
  }


}

const styles = StyleSheet.create({ 
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
  }
});
