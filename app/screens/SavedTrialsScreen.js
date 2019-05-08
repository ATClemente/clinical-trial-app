import React from 'reactn';
import { 
  AsyncStorage,
  FlatList,
  Text,
  View,
 } from 'react-native';

export default class SavedTrialScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trials: this.global.trials
    }
  }

  render() {
    // console.log(this.state.trials);
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
}
