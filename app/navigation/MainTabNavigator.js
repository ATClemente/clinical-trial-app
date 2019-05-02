import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ClinicalTrialSearchScreen from '../screens/ClinicalTrialSearchScreen'
import AppointmentsScreen from '../screens/AppointmentsScreen'
import SettingsScreen from '../screens/SettingsScreen';
import CancerNews from '../screens/CancerNews';
import CancerRSS from '../screens/CancerRSS';

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

const AppointmentsStack = createStackNavigator({
  Appointments: {
    screen: AppointmentsScreen,
    navigationOptions: {
      title: 'Appointments'
    }
  }
});

AppointmentsStack.navigationOptions = {
  tabBarLabel: 'Appointments',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'}
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
            name={Platform.OS === 'ios' ? 'ios-paper' : 'md-paper'}
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
  TrialSearchStack,
    CancerNewsStack,
    CancerRSSStack,
  AppointmentsStack,
    SettingsStack, 
  
});
