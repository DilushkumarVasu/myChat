import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import FontAwsome from 'react-native-vector-icons/FontAwesome';

export default ({logoStyle,logoTextStyle}) => (
    <View style={{justifyContent:'center',
    alignItems:'center',
    flex:1,
    paddingTop:50,}}>
            {/* <SimpleLineIcons name="people" size={60} color='white'/> */}
            <FontAwsome 
            name="users"
            color="#1ABFD6"
            size={120}
            />
    </View>
); 
