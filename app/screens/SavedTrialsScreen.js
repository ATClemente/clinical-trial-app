import React from 'reactn';
import SavedTrialResults from '../components/SavedTrialResults';

export default class SavedTrialScreen extends React.PureComponent {
  render() {
    return (
      <SavedTrialResults 
        trials={this.global.trials}
      />
    )
  }
}
