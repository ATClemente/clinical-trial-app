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
  FlatList
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';

export default class ClinicalTrialSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        text: 'Useless Placeholder',
    };
  }

  render() {
    if(this.props.searchData.total == undefined || this.props.searchData.total == 0){
        return (
            <Text style={styles.noResultsView}>No results yet. Run a search and see what's out there :)</Text>
        );
    }
    else{
        return (
            <View style={styles.allResultsView}>
                <FlatList 
                    data={this.props.searchData.trials}
                    renderItem={this._renderItem}
                    keyExtractor={(item) => item[QueryConstants.NCT_ID]} 
                />
            </View>
        );
    }
  }

  _renderItem = ({item, index}) => (

    <View style = {styles.itemView}>
        <TouchableOpacity onPress={() => Alert.alert("Summary:", item[QueryConstants.BRIEF_SUMMARY])}>
            <Text>{(index+1).toString()}. {item[QueryConstants.BRIEF_TITLE]}</Text>
        </TouchableOpacity>
        <Text>Phase: {item[QueryConstants.PHASE][QueryConstants.PHASE]}</Text>
        <Text>Age: {ClinicalTrialAPIUtil.getAgeRestrictions(item)}</Text>
        <Text>Gender: {ClinicalTrialAPIUtil.getGenderRestrictions(item)}</Text>
    </View>

  );


}

const styles = StyleSheet.create({ 
  allResultsView:{
    padding: 20,
    flex: 1
  },
  noResultsView:{
    padding: 20
  },
  itemView: {
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});
