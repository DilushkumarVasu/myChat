import React, { useState, useContext } from 'react';
import { View, Text, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { globalStyle, color } from '../../utility';
import  { Logo, InputField, RoundCornerButton } from '../../component';
import { Store } from '../../context/store';
import { LOADING_START, LOADING_STOP } from '../../context/actions/types';
import { LoginRequest } from '../../network';
import firebase from "../../firebase/config";
import { setAsyncStorage, keys } from "../../asyncStorage";
import { setUniqueValue,keyboardVerticalOffset } from '../../utility/constants';

function Login({navigation}){
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [showLogo,toggleLogo] = useState(true);
    const [credentials,setCredentials] = useState({
        email:"",
        password:""
    });

    const {email,password} = credentials;

    const onLoginPress = () => {
        if(!email){
            alert("Email is required");
        }else if(!password){
            alert("Password is required");
        }else{
            dispatchLoaderAction({
                type:LOADING_START,
            });
            LoginRequest(email,password)
                .then((res)=>{
                    //additionalUserInfo --> finds out the user already has an account
                    if(!res.additionalUserInfo){
                        dispatchLoaderAction({
                            type:LOADING_STOP,
                        });
                        alert(res);
                        return;
                    }
                    setAsyncStorage(keys.uuid,res.user.uid);
                    setUniqueValue(res.user.uid);
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    navigation.replace('Dashboard');
                })
                .catch((err)=>{
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                      });
                    alert(err);
                });
        }
    };

    const handleOnChange = (name,value) => {
        setCredentials({
            ...credentials,
            [name]:value
        });
    };
    
    //onFoucs input
    const handleFocus = () => {
        setTimeout(()=>{
            toggleLogo(false);
        },200);
    };

    //onBlur input
    const handleBlur = () => {
        setTimeout(()=>{
            toggleLogo(true);
        },200);
    };


    return(
        <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={[globalStyle.flex1, { backgroundColor:'#D8F3F7'}]}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[globalStyle.flex1,{backgroundColor:'#D8F3F7',flex: 1,paddingTop: Platform.OS === 'android' ? 25 : 0}]}>
            {/* {
                showLogo && (
                    <View style={[globalStyle.containerCentered]}>
                        <Logo />
                    </View>
                )
            } */}
            <View style={[globalStyle.containerCentered]}>
                <Logo />
            </View>
            <View style={[globalStyle.flex2,globalStyle.sectionCentered]}>
                <InputField 
                    placeholder="Enter email" 
                    value={email}
                    onChangeText={(text)=>handleOnChange('email',text)}    
                    onFocus={() => handleFocus()}
                    onBlur={()=>handleBlur()}
                />
                <InputField 
                    placeholder="Enter password" 
                    secureTextEntry={true} 
                    value={password}
                    onChangeText={(text)=>handleOnChange('password',text)} 
                    onFocus={() => handleFocus()}
                    onBlur={()=>handleBlur()}
               />
                <RoundCornerButton title="Login" onPress={()=>onLoginPress()}/>
                <Text style={{
                    fontSize:26,
                    fontWeight:'bold',
                    color:color.SECONDARY
                }}
                onPress={()=>navigation.navigate('SignUp')}
                >SignUp</Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default Login;