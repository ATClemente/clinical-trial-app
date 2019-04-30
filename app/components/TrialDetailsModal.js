import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
  Alert,
  TextInput,
  Picker,
  FlatList,
  Modal,
  TouchableHighlight
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import * as QueryConstants from '../constants/MainSearchQueryParams.js';
import ClinicalTrialAPIUtil from '../components/ClinicalTrialAPIUtil.js';

export default class TrialDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            trial: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            modalVisible: nextProps.modalVisible,
            trial: nextProps.trial,
        })
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={ false }
                visible={ this.state.modalVisible }
                onRequestClose={() => { this.props.setModalVisible(false) }}>
                    <View>
                        <View>
                            <Text>{this.state.trial[QueryConstants.BRIEF_TITLE]}</Text>
                            <TouchableHighlight
                                onPress = {() => { this.props.setModalVisible(false) }}
                            >
                                <Text>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
            </Modal>
        )
    }


}

const styles = StyleSheet.create({ 
  allResultsView:{
    //padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom:20,
    flex: 1
  },
  noResultsView:{
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  itemView1: {
    backgroundColor: "#fcfdff",
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  itemView2: {
    backgroundColor: "#D3D3D3",
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  pageIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  titleText:{
    color: "#409ae0",
    textDecorationLine: 'underline'
  }
});
