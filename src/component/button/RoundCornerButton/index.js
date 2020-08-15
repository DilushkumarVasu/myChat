import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from './styles';

export default ({title, btnStyle, btnTextStyle, onPress}) => (
  <TouchableOpacity style={{ backgroundColor:'#93278f',padding:5,
    width:'30%',
    marginTop:30,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center'}} 
    onPress={onPress}
  >
    <Text style={[styles.text, btnTextStyle]}>{title}</Text>
  </TouchableOpacity>
);
