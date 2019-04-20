import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Alert
} from 'react-native';

import * as QueryConstants from '../constants/MainSearchQueryParams.js';

 class ClinicalTrialAPIUtil extends Component {

   static testFunc = () => {
    Alert.alert("Called code from the other file");
  }

  static async sendPostRequest
  (size = 10, useInclude = true, current_trial_status = "active",
    primary_purpose_code = "treatment", keywords = "", postal_code = null,
    distance = "10", distanceType = "mi"){

      /*var params = {};
      params[QueryConstants.SIZE_STR] = size;
      params[QueryConstants.CURRENT_TRIAL_STATUS_STR] = current_trial_status;
      params[QueryConstants.PURPOSE_CODE_STR] = primary_purpose_code;
      if(postal_code !== null){
        params[QueryConstants.POSTAL_CODE_STR] = postal_code;
        params[QueryConstants.DISTANCE_STR] = (distance + distanceType);
      }
      if(keywords !== "" && keywords !== null ){
        params[QueryConstants.KEYWORD_STR] = keywords.toLowerCase();
      }
      if(useInclude){
        params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;
      }

      fetch('https://clinicaltrialsapi.cancer.gov/v1/clinical-trials', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          //{size: '5'}
          params
        ),
      }).then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson.total);
          return responseJson;
          //return responseJson.movies;
        })
      .catch((error) => {
        console.error(error);
      });*/

      var params = {};
      params[QueryConstants.SIZE_STR] = size;
      params[QueryConstants.CURRENT_TRIAL_STATUS_STR] = current_trial_status;
      params[QueryConstants.PURPOSE_CODE_STR] = primary_purpose_code;
      if(postal_code !== null){
        params[QueryConstants.POSTAL_CODE_STR] = postal_code;
        params[QueryConstants.DISTANCE_STR] = (distance + distanceType);
      }
      if(keywords !== "" && keywords !== null ){
        params[QueryConstants.KEYWORD_STR] = keywords.toLowerCase();
      }
      if(useInclude){
        params[QueryConstants.INCLUDE_STR] = QueryConstants.INCLUDE_ARR;
      }

      try {
        const response = await fetch('https://clinicaltrialsapi.cancer.gov/v1/clinical-trials', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        return await response.json();
      } catch (err) {
           console.error(err);
      }
  }

  //Functions for processing certain parts of the response
  //Takes the response JSON of a trial as an argument and returns a string for display


  static getGenderRestrictions(trial){
    var genderRes = trial[QueryConstants.ELIGIBILITY][QueryConstants.STRUCTURED][QueryConstants.GENDER];
    if(genderRes === "BOTH"){
      return "Male or Female";
    }
    else if(genderRes === "MALE"){
      return "Male";
    }
    else if(genderRes === "FEMALE"){
      return "Female";
    }
    else{
      console.error("Gender returned was not an expected value");
      return genderRes;
    }
  }

  static getAgeRestrictions(trial){
    var returnStr = "";

    var minAgeNum = trial[QueryConstants.ELIGIBILITY][QueryConstants.STRUCTURED][QueryConstants.MIN_AGE_NUMBER];
    var maxAgeNum = trial[QueryConstants.ELIGIBILITY][QueryConstants.STRUCTURED][QueryConstants.MAX_AGE_NUMBER];

    var minAgeUnit = trial[QueryConstants.ELIGIBILITY][QueryConstants.STRUCTURED][QueryConstants.MIN_AGE_UNIT].toString();
    var maxAgeUnit = trial[QueryConstants.ELIGIBILITY][QueryConstants.STRUCTURED][QueryConstants.MAX_AGE_UNIT].toString();

    returnStr += minAgeNum.toString();
    if(maxAgeNum >= 999){
      returnStr += " " + maxAgeUnit + " and older";
      return returnStr;
    }
    else if(minAgeUnit === maxAgeUnit){
      returnStr += " to " + maxAgeNum.toString() + " " + maxAgeUnit;
      return returnStr;
    }
    else{
      returnStr += " " + minAgeUnit + " to " + maxAgeNum.toString() + " " + maxAgeUnit;
      return returnStr; 
    }
  }



  static testPostReq = () => {
    var params = {};
    var sizeStr = "size";
    params[sizeStr] = 5;

    var includeStr = "include";
    var includeArr = [];

    includeArr.push("nci_id");
    includeArr.push("nct_id");
    includeArr.push("brief_title");


    params[includeStr] = includeArr;


    fetch('https://clinicaltrialsapi.cancer.gov/v1/clinical-trials', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        //{size: '5'}
        params
      ),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        //return responseJson.movies;
      })
    .catch((error) => {
      console.error(error);
    });
  }
}

//const ClincalTrialAPIUtility = new ClinicalTrialAPI();
//export default ClincalTrialAPIUtility;

export default ClinicalTrialAPIUtil;