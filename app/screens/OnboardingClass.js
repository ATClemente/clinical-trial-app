import React from 'react';
import Onboarding from 'react-native-onboarding-screen';
import {  Image } from 'react-native';


export default class OnboardingClass extends React.Component {
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
              //  backgroundImage={require('https://media.glassdoor.com/sqll/1177597/zero-the-end-of-prostate-cancer-squarelogo-1455293657416.png')}

          //   <Image source={require('./images/circle.png')} />

                pages={Pages}
            />
        );
    }
}
