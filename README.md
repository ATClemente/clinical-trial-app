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

