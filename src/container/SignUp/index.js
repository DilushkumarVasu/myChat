import React, { useState, useContext } from 'react';
import { View, Text, Platform,ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { globalStyle, color } from '../../utility';
import  { Logo, InputField, RoundCornerButton } from '../../component';
import { Store } from '../../context/store';
import { LOADING_START, LOADING_STOP } from '../../context/actions/types';
import { SignUpRequest, AddUser } from '../../network';
import firebase from '../../firebase/config';
import { setAsyncStorage, keys } from "../../asyncStorage";
import { setUniqueValue,keyboardVerticalOffset } from '../../utility/constants';

function SignUp({navigation}){
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [showLogo,toggleLogo] = useState(true);
    const [credentials,setCredentials] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const {name,email,password,confirmPassword} = credentials;

    const onSignUpPress = () => {
        if(!name){
            alert("Name is required");
        }
        else if(!email){
            alert("Email is required");
        }else if(!password){
            alert("Password is required");
        }
        else if(password!==confirmPassword){
            alert("Password did not match");
        }else{
            dispatchLoaderAction({
                type:LOADING_START,
            });
            SignUpRequest(email,password)
                .then((res)=>{
                    //additionalUserInfo --> finds out the user already has an account
                    if(!res.additionalUserInfo){
                        dispatchLoaderAction({
                            type:LOADING_STOP,
                        });
                        alert(res);
                        return;
                    }
                    let uid = firebase.auth().currentUser.uid;
                    let profileImage = '';
                    AddUser(name,email,uid,profileImage)
                        .then(()=>{
                            setAsyncStorage(keys.uuid,uid);
                            setUniqueValue(uid);
                            dispatchLoaderAction({
                                type:LOADING_STOP,
                            });
                            navigation.replace('Login');
                        })
                        .catch((err)=>{
                            dispatchLoaderAction({
                                type:LOADING_STOP,
                            });
                            alert(err);
                        });
                })
                .catch((err)=>{
                    dispatchLoaderAction({
                        type:LOADING_STOP,
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
        //  <KeyboardAvoidingView
        //     keyboardVerticalOffset={keyboardVerticalOffset}
        //     behavior={Platform.OS == "ios" ? "padding" : "height"}
        //     style={[globalStyle.flex1, { backgroundColor:'#D8F3F7'}]}
        // >
        // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={[globalStyle.flex1,{backgroundColor:'#D8F3F7',flex: 1,paddingTop: Platform.OS === 'android' ? 50 : 0}]}>
            {
                showLogo && (
                    <View style={[globalStyle.containerCentered]}>
                        <Logo />
                    </View>
                )
            }
            {/* <View style={[globalStyle.containerCentered]}>
                <Logo />
            </View> */}
            <View style={[globalStyle.flex2,globalStyle.sectionCentered]}>
                <InputField 
                    placeholder="Enter name" 
                    value={name}
                    onChangeText={(text)=>handleOnChange('name',text)}   
                    onFocus={() => handleFocus()}
                    // onBlur={()=>handleBlur()} 
                />
                <InputField 
                    placeholder="Enter email" 
                    value={email}
                    onChangeText={(text)=>handleOnChange('email',text)}  
                    onFocus={() => handleFocus()}
                    // onBlur={()=>handleBlur()}  
                />
                <InputField 
                    placeholder="Enter password" 
                    secureTextEntry={true} 
                    value={password}
                    onChangeText={(text)=>handleOnChange('password',text)} 
                    onFocus={() => handleFocus()}
                    // onBlur={()=>handleBlur()}
                />
                <InputField 
                    placeholder="Confirm password" 
                    secureTextEntry={true} 
                    value={confirmPassword}
                    onChangeText={(text)=>handleOnChange('confirmPassword',text)} 
                    onFocus={() => handleFocus()}
                    // onBlur={()=>handleBlur()}
                />
                <RoundCornerButton title="SignUp" onPress={()=>onSignUpPress()}/>
                <Text style={{
                    fontSize:26,
                    fontWeight:'bold',
                    color:color.SECONDARY
                }}
                onPress={()=>navigation.navigate('Login')}
                >Login</Text>
            </View>
        </ScrollView>
        // </TouchableWithoutFeedback>
        // </KeyboardAvoidingView>
    );
}

export default SignUp;