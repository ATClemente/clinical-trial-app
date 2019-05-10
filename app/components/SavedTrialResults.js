import React from 'reactn';
import { 
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
 } from 'react-native';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';
import TrialCard from '../components/TrialCard';
import TrialDetailsModal from '../components/TrialDetailsModal';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';

export default class SavedTrialResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      trials: [],
      displayTrialDetails: false,
      currentTrial: {}
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
    const params = {};
    params[QueryConstants.NCT_ID] = trials;
    params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;
    const response = await ClinicalTrialAPIUtil.sendPostRequest(params);
    return response ? response.trials : null;
  }

  setModalVisible(visible) {
    this.setState({displayTrialDetails: visible});
  }

  setUpModal(item) {
    this.setState({
      displayTrialDetails: true,
      currentTrial: item
    });
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
          style={{ marginVertical: 4, marginTop: 0, marginBottom: 15 }}
          data={this.state.trials}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item[QueryConstants.NCT_ID]}
          ListEmptyComponent={this._listEmptyComponent}
        />
        <TrialDetailsModal
          modalVisible={this.state.displayTrialDetails}
          setModalVisible={vis => this.setModalVisible(vis)}
          searchRadius={10}
          trial={this.state.currentTrial}
        />
      </View>
    )
  }

  _renderItem = ({ item, index }) => {
    const ViewTrialButton = (
      <TouchableOpacity 
        style={{ backgroundColor: '#e8efff', borderColor: '#b9ccea', borderWidth: 1, borderRadius: 4, marginTop: 8 }}
        onPress={() => this.setUpModal(item)}>
        <Text style={{ color: '#324e7a', alignSelf: 'center', paddingVertical: 6 }}>View Trial</Text>
      </TouchableOpacity>
    );
    return (
      <TrialCard 
        item={item} 
        title={item[QueryConstants.BRIEF_TITLE]} 
        ViewTrialButton={ViewTrialButton}
      />
    )
  }

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
