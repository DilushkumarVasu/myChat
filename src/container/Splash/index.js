import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Logo } from '../../component';
import { globalStyle, color } from '../../utility';
import { getAsyncStorage, keys } from '../../asyncStorage';
import { setUniqueValue } from '../../utility/constants';

/*useEffects-->The Effect Hook lets you perform side effects in function components,
                Data fetching, setting up a subscription,and manually changing the DOM 
                in React components are all examples of side effects.
*/

const Splash = ({navigation}) => {
    useEffect(()=>{
        const redirect = setTimeout(()=>{
            getAsyncStorage(keys.uuid)
                .then((uuid)=>{
                    if(uuid){
                        setUniqueValue(uuid);
                        navigation.replace('Dashboard');
                    }
                    else{
                        navigation.replace('Login');
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    navigation.replace('Login');
                });
        },3000);
        return ()=>clearTimeout(redirect);
    },[navigation]);
    return (
        <View style={[globalStyle.containerCentered,{backgroundColor:'#D8F3F7'}]}>
            <Logo />
        </View>
    )
}

export default Splash;