import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    justifyContent: 'center',
    width: '85%'
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%'
  },
  formInput: {
    height: 40,
    borderColor: Colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 5
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 5
  },
  buttonGreen: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 5
  },
  enabled: {
    opacity: 1
  },
  disabled: {
    opacity: 0.5
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    height: 20
  }
});
