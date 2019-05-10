import React from 'reactn';
import { 
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  Text,
  TouchableOpacity,
  View,
 } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';

export default class SavedTrialResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
  }

  async componentWillMount() {
    this._loadTrials(this.global.trials);
  }

  async componentWillReceiveProps(nextProps) {
    this._loadTrials(nextProps.trials);
  }

  _loadTrials = async (savedTrials) => {
    this.setState({ isLoading: true});
    const params = {};
    const trials = savedTrials.map(trial => trial.trial_id);
    params[QueryConstants.NCT_ID] = trials;
    params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;

    const response = await ClinicalTrialAPIUtil.sendPostRequest(params);
    if (response) {
      this.setState({ trials: response.trials });
    }
    this.setState({ isLoading: false });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator
            size='large'
          />
        </View>
      );
    }
    return (
      <View>
        <FlatList
          style={{ marginVertical: 4 }}
          data={this.state.trials}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item[QueryConstants.NCT_ID]}
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
        <Text style={{ color: '#333', fontWeight: '500' }}>{item[QueryConstants.BRIEF_TITLE]}</Text>
        <Divider
          backgroundColor='#ccc'
          style={{ marginVertical: 6 }}
        />
        <Text>Phase: {ClinicalTrialAPIUtil.getPhase(item)}</Text>
        <Text>Age: {ClinicalTrialAPIUtil.getAgeRestrictions(item)}</Text>
        <Text>Gender: {ClinicalTrialAPIUtil.getGenderRestrictions(item)}</Text>
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
}
