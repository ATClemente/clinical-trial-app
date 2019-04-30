# clinical-trial-app

### Get user's trials
* Route: /users/trials
* Method: **GET**
* Headers: Authorization: jsonwebtoken
* Example Request:
```
import axios from 'axios';
import Urls from '../constants/Urls';

const token = await AsyncStorage.getItem('jwt');
const { data } = await axios.get(
  Urls.server + '/user/trials',
  {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    }
  }
);
```
* Example Response:
```
{
    "username": "James",
    "success": true,
    "savedTrials": [
        {
            "trialId": "NCT-1223",
            "createdDate": "2019-05-01T03:53:06.547Z"
        },
        {
            "trialId": "NCT-1002",
            "createdDate": "2019-05-01T03:58:29.869Z"
        },
        {
            "trialId": "NCT-1001",
            "createdDate": "2019-05-01T03:58:34.569Z"
        },
        {
            "trialId": "NCT-1010",
            "createdDate": "2019-05-01T04:18:48.672Z"
        }
    ]
}
```

### Save trial
* Route: /users/trials
* Method: **POST**
* Headers: Authorization: jsonwebtoken
* Example Request:
```
import axios from 'axios';
import Urls from '../constants/Urls';

const token = await AsyncStorage.getItem('jwt');
const { data } = await axios.post(
  Urls.server + '/user/trials',
  {
	  "trialId": "NCT-1001"
  },
  {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    }
  }
);
```
* Example Response: Same as GET trials

### Delete trial
* Route: /users/trials/{trial_id}
* Method: **DELETE**
* Headers: Authorization: jsonwebtoken
* Example Request:
```
import axios from 'axios';
import Urls from '../constants/Urls';

const token = await AsyncStorage.getItem('jwt');
const trialId = "NCT-1001"

const { data } = await axios.delete(
  Urls.server + '/user/trials' + trialId,
  {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    }
  }
);
```
* Example Response:
```
{
    "success": true,
    "status": "Trial deleted"
}
```
