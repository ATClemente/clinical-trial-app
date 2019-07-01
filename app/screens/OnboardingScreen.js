import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';

const windowSize = Dimensions.get('screen');
const imgWidth = windowSize.width - 40;
const searchRatio = 1125/1084;
const viewRatio = 1125/1152;
const newsRatio = 1125/1295;

export default ({ navigation }) => {
  return (
    <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
      <View style={styles.slide}>
        <Text style={styles.header}>Find Clinical Trials</Text>
        <Text style={styles.subtitle}>Search for clinical trials by location, gender, and phase.</Text>
        <View>
          <Image source={require('../assets/images/01_search.png')} style={{ width: imgWidth, height: imgWidth/searchRatio }} />
        </View>
      </View>
      <View style={styles.slide}>
        <Text style={styles.header}>View, Save, Share</Text>
        <Text style={styles.subtitle}>View trial details, save and share with others.</Text>
        <View>
          <Image source={require('../assets/images/02_view.png')} style={{ width: imgWidth, height: imgWidth/viewRatio }} />
        </View>
      </View>
      <View style={styles.slideLast}>
        <View></View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header}>News and Research</Text>
          <Text style={styles.subtitle}>Read about the latest cancer news, research, and drugs</Text>
          <Image source={require('../assets/images/03_news.png')} style={{ width: imgWidth, height: imgWidth/newsRatio }} />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TrialSearchStack')}
          >
            <Text style={styles.btnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#254882'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideLast: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    color: '#d2ddef',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10
  },
  subtitle: {
    color: '#b5c7e5',
    fontSize: 18,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  button: {
    padding: 20,
    marginBottom: 5
  },
  btnText: {
    color: '#b5c7e5', 
    fontSize: 16
  }
});
