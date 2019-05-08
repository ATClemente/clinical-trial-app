import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ClinicalTrialSearchScreen from '../screens/ClinicalTrialSearchScreen'
import SavedTrialsScreen from '../screens/SavedTrialsScreen'
import SettingsScreen from '../screens/SettingsScreen';
import CancerNews from '../screens/CancerNews';
import CancerRSS from '../screens/CancerRSS';
import About from '../screens/About'

const AboutStack = createStackNavigator({
    screen: About,
});

AboutStack.navigationOptions = {
    tabBarLabel: 'About',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
        />
    ),
};

const TrialSearchStack = createStackNavigator({
  TrialSearch: ClinicalTrialSearchScreen,
});

TrialSearchStack.navigationOptions = {
  tabBarLabel: 'Trial Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};

const SavedTrialsStack = createStackNavigator({
  SavedTrials: {
    screen: SavedTrialsScreen,
    navigationOptions: {
      title: 'Saved Trials'
    }
  },
});

SavedTrialsStack.navigationOptions = {
  tabBarLabel: 'Saved Trials',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: 'Settings'
    }
  }
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  ),
};

const CancerNewsStack = createStackNavigator({
    News: {
      screen: CancerNews,
      navigationOptions: {
        title: 'Cancer Research'
      }
    },
});

CancerNewsStack.navigationOptions = {
    tabBarLabel: ' Research',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-book' : 'md-book'}
            />
    ),
};

const CancerRSSStack = createStackNavigator({
    RSS: {
        screen: CancerRSS,
        navigationOptions: {
            title: 'Cancer News'
        }
    },
});

CancerRSSStack.navigationOptions = {
    tabBarLabel: ' News',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-paper' : 'md-paper'}
        />
    ),
};
// Do this last to add a button 
export default createBottomTabNavigator({
  AboutStack,
  TrialSearchStack,
  SavedTrialsStack,
  CancerNewsStack,
  CancerRSSStack,
  SettingsStack, 
});
