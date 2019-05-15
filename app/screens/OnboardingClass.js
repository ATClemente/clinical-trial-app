import React from 'react';
import Onboarding from 'react-native-onboarding-screen';

export default class OnboardingClass extends React.Component {
    render() {
        const Pages = [
            {
                title: 'Welcome',
                subtitle: 'to the FightCancer Application. Here you can browse for clinical trials for cancer, view news and scholarly articles on cancer developments, and have a user profile to bookmark items of interest.'
            },
            {
                title: 'Clinical Trials',
                subtitle: 'Search for clinical trials and save any trials to your Saved Trials list',
                action: {
                    title: "Clinical Trials",
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
               // backgroundImage={require('https://media.glassdoor.com/sqll/1177597/zero-the-end-of-prostate-cancer-squarelogo-1455293657416.png')}
                pages={Pages}
            />
        );
    }
}
