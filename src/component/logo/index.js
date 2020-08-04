import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default ({logoStyle,logoTextStyle}) => (
    <View style={[styles.logo,logoStyle]}>
        <Text style={[styles.text,logoTextStyle]}>
            <SimpleLineIcons name="people" size={60} color='white'/>
        </Text>
    </View>
); 