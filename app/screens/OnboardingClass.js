import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {  Image } from 'react-native';


export default class OnboardingClass extends React.Component {
  endOnboarding = () => {
    this.props.navigation.navigate('TrialSearchStack');
  }

  render() {
    const backgroundColor = '#254882';
    return (
      <Onboarding
        pages={[
          {
            backgroundColor,
            title: 'Welcome to the Cancer Application',
            subtitle: ' ',
            image: <Image source={require('../assets/images/orange.png')} />,
          },
          {
            backgroundColor,
            title: 'Clinical Trials',
            subtitle: 'Search for clinical trials by location, gender, and phase.',
            image: <Image source={require('../assets/images/01_search.png')} style={{ width: 300, height: 300 }} />,
          },
          {
            backgroundColor,
            image: <Image source={require('../assets/images/orange.png')} />,
            title: 'Research Articles',
            subtitle: 'View the latest scholarly research papers on cancer development'
          },
          {
            backgroundColor,
            image: <Image source={require('../assets/images/orange.png')} />,
            title: 'Cancer News',
            subtitle: 'View the latest news on cancer development'
            
          },
          {
            backgroundColor,
            image: <Image source={require('../assets/images/orange.png')} />,
            title: 'FDA Approved Drugs',
            subtitle: 'View the latest cancer drugs approved by the FDA' 
          }
        ]}
      onDone = {this.endOnboarding } 
      onSkip = {this.endOnboarding }
      containerStyles={{ alignItems: 'flex-start', justifyContent: 'center' }}
      imageContainerStyles={{ alignSelf: 'flex-start', paddingBottom: 20, paddingTop: 0, marginTop: 0 }}
      // titleStyles={{ backgroundColor: 'green' }}
      // subTitleStyles={{ backgroundColor: 'violet' }}
    />
    );
  }
}
