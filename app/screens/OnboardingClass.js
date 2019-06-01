import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {  Image } from 'react-native';


export default class OnboardingClass extends React.Component {


    endOnboarding = () => {

        //Take the user back to main 
        this.props.navigation.navigate('TrialSearchStack')

    }

    


    render() {
        const Pages = [
            {
                title: 'Welcome',
                subtitle: 'to the FightCancer application. Here you can search for cancer clinical trials, view news and scholarly articles on latest cancer developments, and have a user profile to bookmark items and view them later.'
            },
            {
                title: 'Clinical Trials',
                subtitle: 'Search for clinical trials and save any trials to your Saved Trials list',
                action: {
                  //  title: "Clinical Trials",
                   // onPress: this.showFacebookLogin
                }
            },

            {
                title: 'Research Articles',
                subtitle: 'View the latest scholarly research papers on cancer development',
                action: {
                   // title: "Research Articles",
                    // onPress: this.showFacebookLogin
                }
            },
            {
                title: 'Cancer News',
                subtitle: 'View the latest news on cancer development',
                action: {
                   // title: "Cancer News",
                    // onPress: this.showFacebookLogin
                }
            },
         

            {
                title: "Great",
                subtitle: "That's all for now. As you use the app, we'll learn about the events you like and use this to personalize your experience.",
                action: {
                    title: "Let's Get Started",
                  //  onPress: this.finishOnboarding
                }
            }
        ];
        return (
            <Onboarding
            pages={[
              {
                backgroundColor: '#fff',
                title: 'Welcome to the Cancer Application',
                subtitle: ' ',
                image: <Image source={require('../assets/images/orange.png')} />,
                bottomBarHeight: 10

              },

              {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/images/orange.png')} />,
                title: 'Clinical Trials',
                subtitle: 'Search for clinical trials and save any trials to your Saved Trials list',
                bottomBarHeight: 10

                
              },
              {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/images/orange.png')} />,
                title: 'Research Articles',
                subtitle: 'View the latest scholarly research papers on cancer development'
                
              },
              {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/images/orange.png')} />,
                title: 'Cancer News',
                subtitle: 'View the latest news on cancer development'
                
              },

              {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/images/orange.png')} />,
                title: 'FDA Approved Drugs',
                subtitle: 'View the latest cancer drugs approved by the FDA'
                
              },
        
            
              {
                backgroundColor: '#fff',
                image: <Image source={require('../assets/images/orange.png')} />,
                title: 'Great!',
                subtitle: "That's all for now. Let's get started."
                
              }
            

            
            
            ]}

            onDone = {this.endOnboarding } 
            onSkip = {this.endOnboarding } 

          />





        );
    }
}
