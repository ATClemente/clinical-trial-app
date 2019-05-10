import React from 'reactn';
import SavedTrialResults from '../components/SavedTrialResults';

export default class SavedTrialScreen extends React.Component {
  render() {
    return (
      <SavedTrialResults 
        trials={this.global.trials}
      />
    )
  }
}
