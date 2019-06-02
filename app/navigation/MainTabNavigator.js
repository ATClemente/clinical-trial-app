import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ClinicalTrialSearchScreen from '../screens/ClinicalTrialSearchScreen'
import SavedTrialsScreen from '../screens/SavedTrialsScreen'
import SettingsScreen from '../screens/SettingsScreen';
import ResearchScreen from '../screens/ResearchScreen';
import NewsScreen from '../screens/NewsScreen';
import About from '../screens/About'
import OnboardingClass from '../screens/OnboardingClass'
import DrugsScreen from '../screens/DrugsScreen'
import ArticleScreen from '../screens/ArticleScreen';
const AboutStack = createStackNavigator({
    screen: About,
});

AboutStack.navigationOptions = {
    tabBarLabel: 'About',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name='ios-information-circle-outline'
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
      name='ios-search'
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
      name='ios-settings'
    />
  ),
};

const ResearchStack = createStackNavigator({
    Research: {
      screen: ResearchScreen,
      navigationOptions: {
        title: 'Cancer Research'
      }
    },
    ResearchArticle: {
      screen: ArticleScreen
    }
});

ResearchStack.navigationOptions = {
    tabBarLabel: ' Research',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name='md-book'
            />
    ),
};

const NewsStack = createStackNavigator({
    News: {
        screen: NewsScreen,
        navigationOptions: {
            title: 'Cancer News'
        }
    },
    NewsArticle: {
      screen: ArticleScreen
    }
});

NewsStack.navigationOptions = {
    tabBarLabel: ' News',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name='md-paper'
        />
    ),
};



const OnboardingStack = createStackNavigator({
    Onboarding: {
        screen: OnboardingClass,
        navigationOptions: {
        }
    },
});

OnboardingStack.navigationOptions = {
    tabBarLabel: ' Temp_Onboarding_Tab',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name='md-paper'
        />
    ),
};

const DrugsStack = createStackNavigator({
    Drugs: {
        screen: DrugsScreen,
        navigationOptions: {
            title: 'FDA Drugs'
        }
    },
    DrugsArticle: {
      screen: ArticleScreen
    }
});

DrugsStack.navigationOptions = {
    tabBarLabel: ' FDA Drugs',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name='md-paper'
        />
    ),
};
// Do this last to add a button 
export default createBottomTabNavigator({

  TrialSearchStack,
  SavedTrialsStack,
  ResearchStack,
  NewsStack,
  DrugsStack,
  OnboardingStack,
  SettingsStack
});
