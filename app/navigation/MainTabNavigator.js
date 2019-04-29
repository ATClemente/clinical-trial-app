import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ClinicalTrialSearchScreen from '../screens/ClinicalTrialSearchScreen'
// import HomeScreen from '../screens/HomeScreen';
// import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CancerNews from '../screens/CancerNews';

const TrialSearchStack = createStackNavigator({
  TrialSearch: ClinicalTrialSearchScreen,
});

TrialSearchStack.navigationOptions = {
  tabBarLabel: 'Trial Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: 'Settings'
    }
  },
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const CancerNewsStack = createStackNavigator({
    News: CancerNews,
});

CancerNewsStack.navigationOptions = {
    tabBarLabel: 'Cancer News',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
            />
    ),
};

// Do this last to add a button 
export default createBottomTabNavigator({
  TrialSearchStack,
  CancerNewsStack,
  SettingsStack
});
