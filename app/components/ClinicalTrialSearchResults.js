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
import { Card } from 'react-native-elements';
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
            <Text>Run a search for clinical trials and see what's out there :)</Text> 
          </View>
        );
    }
    else{
        return (
            <View style={styles.allResultsView}>
              <TrialDetailsModal
                modalVisible = { this.state.displayTrialDetails }
                setModalVisible = { (vis) => { this.setModalVisible(vis) }}
                trial = { this.state.currentTrial }
            />
              <FlatList
                style={{ marginBottom: 15 }}
                data={this.props.searchData.trials}
                renderItem={this._renderItem}
                keyExtractor={(item) => item[QueryConstants.NCT_ID]}
              />
            </View>
        );
    }
  }

  _renderItem = ({item, index}) => {
    const number = (index+(1 + this.props.searchData.trials.length * ( this.props.currentPage - 1 ))).toString();
    const trialText = item[QueryConstants.BRIEF_TITLE];
    return(
      <Card
        containerStyle={{ padding: 0, borderRadius: 5 }}
        wrapperStyle={{ padding: 10 }}
      >
        <View>
          <Text style={{ color: '#333' }}>{`${number}. ${trialText}`}</Text>
          <Text>Phase: {ClinicalTrialAPIUtil.getPhase(item)}</Text>
          <Text>Age: {ClinicalTrialAPIUtil.getAgeRestrictions(item)}</Text>
          <Text>Gender: {ClinicalTrialAPIUtil.getGenderRestrictions(item)}</Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#eee', marginTop: 8 }}
            onPress={() => {this.setUpModal(item)}}>
            <Text style={{ alignSelf: 'center', paddingVertical: 6 }}>View Trial</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );

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

  // _getTotalPageCount = () => {
  //   let totalPages = Math.ceil(this.props.searchData.total / this.props.searchSize);
  //   return totalPages.toString();
  // }


}

const styles = StyleSheet.create({ 
  allResultsView:{
    flex: 1,
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
