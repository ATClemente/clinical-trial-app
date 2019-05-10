import React from 'reactn';
import { 
  AsyncStorage,
  FlatList,
  Text,
  TouchableOpacity,
  View,
 } from 'react-native';
import { Card, Divider } from 'react-native-elements';
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
    if (this.state.trials.length) {
      this._getSingleTrialInfo(this.state.trials[0]);
    }
    return (
      <View>
        <FlatList
          style={{ marginVertical: 4 }}
          data={this.global.trials}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.created_date}
          ListEmptyComponent={this._listEmptyComponent}
        />
      </View>
    )
  }

  _renderItem = ({ item, index }) => (
    <Card
      containerStyle={{ padding: 0, borderRadius: 5 }}
      wrapperStyle={{ padding: 10 }}
    >
      <View>
        <Text style={{ color: '#333', fontWeight: '500' }}>{item.title}</Text>
        <Divider
          backgroundColor='#ccc'
          style={{ marginVertical: 6 }}
        />
        <Text>Phase: {item.phase}</Text>
        <Text>Age: {item.age}</Text>
        <Text>Gender: {item.gender}</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#e8efff', borderColor: '#b9ccea', borderWidth: 1, borderRadius: 4, marginTop: 8 }}
          onPress={() => {}}>
          <Text style={{ color: '#324e7a', alignSelf: 'center', paddingVertical: 6 }}>View Trial</Text>
        </TouchableOpacity>
      </View>
    </Card>
  )

  _listEmptyComponent = () => {
    return (
      <View>
        <Text>
          No trials saved.
        </Text>
      </View>
    )
  }

  _getSingleTrialInfo = (trial) => {
    const params = {};
    params[QueryConstants.NCT_ID] = trial.trial_id;
    params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;

    ClinicalTrialAPIUtil.sendPostRequest(params)
    .then((response) => {
      if(response){
        console.log("Returning trial with only these fields: ");
        for(const key in response.trials[0]){
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
