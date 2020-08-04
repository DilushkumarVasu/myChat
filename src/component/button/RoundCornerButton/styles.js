import {StyleSheet} from 'react-native';
import {appStyle} from '../../../utility';

export default StyleSheet.create({
  btn: {
    backgroundColor: '#0D7170',
    width: '50%',
    height: appStyle.btnHeight,
    borderRadius: appStyle.btnBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: appStyle.btnMarginVertical,
  },
  text: {fontSize: 26, fontWeight: 'bold', color: appStyle.fieldTextColor},
});
