import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Divider } from 'react-native-elements';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';

export default ({ item, title, ViewTrialButton }) => {
  return (
    <Card
      containerStyle={{ padding: 0, borderRadius: 5 }}
      wrapperStyle={{ padding: 10 }}
    >
      <View>
        <Text style={{ color: '#333', fontWeight: '500' }}>{title}</Text>
        <Divider
          backgroundColor='#ccc'
          style={{ marginVertical: 6 }}
        />
        <Text>Phase: {ClinicalTrialAPIUtil.getPhase(item)}</Text>
        <Text>Age: {ClinicalTrialAPIUtil.getAgeRestrictions(item)}</Text>
        <Text>Gender: {ClinicalTrialAPIUtil.getGenderRestrictions(item)}</Text>
        {ViewTrialButton}
      </View>
    </Card>
  )
}
