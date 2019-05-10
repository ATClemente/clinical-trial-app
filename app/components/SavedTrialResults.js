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
    this.state = {
      isLoading: true,
      trials: [],
    };
  }

  async componentDidMount() {
    const trialIds = this.global.trials.map(t => t.trial_id);
    const trialResults = await this._loadTrials(trialIds);
    if (trialResults) {
      this.setState({ trials: trialResults });
    }
    this.setState({ isLoading: false });
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({ isLoading: true});

    const newTrialsList = nextProps.trials.map(t => t.trial_id);
    const oldTrialsList = this.state.trials.map(t => t[QueryConstants.NCT_ID]);
    const add = newTrialsList.filter(t => !oldTrialsList.includes(t));
    const del = oldTrialsList.filter(t => !newTrialsList.includes(t));
    let newState = [];
    if (add.length) {
      const newTrials = await this._loadTrials(add);
      newState = this.state.trials.concat(newTrials);
    }
    if (del.length) {
      newState = this.state.trials.filter(t => !del.includes(t[QueryConstants.NCT_ID]));
    }

    this.setState({ trials: newState, isLoading: false });
  }

  _loadTrials = async (trials) => {
    // console.log('Call API for trials: ' + trials.join(', '));
    const params = {};
    params[QueryConstants.NCT_ID] = trials;
    params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;
    const response = await ClinicalTrialAPIUtil.sendPostRequest(params);
    return response ? response.trials : null;
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
