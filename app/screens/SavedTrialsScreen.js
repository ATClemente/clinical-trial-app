import React from 'reactn';
import { 
  AsyncStorage,
  FlatList,
  Text,
  View,
 } from 'react-native';
 import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';

export default class SavedTrialScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trials: this.global.trials
    }
  }

  render() {
    // console.log(this.state.trials);
    this._getSingleTrialInfo(this.state.trials[0]);
    return (
      <View>
        <Text>Location {this.global.profile.location}</Text>
        <FlatList
          style={{ marginVertical: 4 }}
          data={this.global.trials}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.createdDate}
        />
      </View>
    )
  }

  _renderItem = ({ item, index }) => (
    <View>
      <Text>{item.trialId}</Text>
      <Text>{item.createdDate}</Text>
    </View>
  )

  _getSingleTrialInfo = (trial) => {
    var params = {};
    params[QueryConstants.NCT_ID] = trial.trialId;
    params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;

    ClinicalTrialAPIUtil.sendPostRequest(params)
    .then((response) => {
      if(response){
        console.log("Returning trial with only these fields: ");
        for(var key in response.trials[0]){
          console.log(key);
        }
        //console.log(response);
      }
      else{
        console.log("Error getting single trial data");
      }
    }); 
  }
}
