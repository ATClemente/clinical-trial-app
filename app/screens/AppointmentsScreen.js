import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class AppointmentsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      dob: '',
      gender: false,
      location: '',
      cancerType: '',
      items: {
        '2019-05-02': [{text: 'item 1 - any js object'}],
         '2019-05-23': [{text: 'item 2 - any js object'}],
         '2019-05-24': [],
         '2019-05-25': [{text: 'item 3 - any js object'},{text: 'any js object'}],
      }
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('profile')
      .then(res => JSON.parse(res))
      .then(profile => {
        this.setState({
          username: profile.username,
          email: profile.email || '',
          dob: profile.dob || '',
          gender: profile.gender,
          location: profile.location || '',
          cancerType: profile.cancerType || ''
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  loadItems(day) {
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  render() {
    const today = new Date();
    const offset = today.getTimezoneOffset()/60 * (-1);
    today.setHours(today.getHours() + offset);
    console.log(offset);
    console.log(today);

    return (

    <CalendarList
      pastScrollRange={24}
      futureScrollRange={24}
    />

    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
