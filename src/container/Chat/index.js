import React,{useLayoutEffect, useState, useEffect,Fragment} from 'react';
import {View,Text,SafeAreaView,FlatList,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Platform} from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
//import ImagePicker from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyle, color,appStyle } from '../../utility';
import styles from './styles';
import { InputField,ChatBox } from '../../component';
import firebase from '../../firebase/config';
import { senderMsg, recieverMsg } from '../../network/messeges';
import { deviceHeight } from "../../utility/styleHelper/appStyle";
import { smallDeviceHeight } from "../../utility/constants";
// import { FlatList } from 'react-native-gesture-handler';


const Chat = ({route,navigation}) => {
    const {params} = route;
    const {name,img,imgText,guestUserId,currentUserId} = params;
    const [msgValue,setMsgValue] = useState('');
    const [messeges,setMesseges] = useState([]);
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle:<Text>{name}</Text>
        });
    },[navigation]);

    useEffect(()=>{
        try {
            firebase
                .database()
                .ref('messeges')
                .child(currentUserId)
                .child(guestUserId)
                .on('value',(dataSnapshot)=>{
                    let msgs = [];
                    dataSnapshot.forEach((child)=>{
                        msgs.push({
                            sendBy:child.val().messege.sender,
                            recievedBy:child.val().messege.reciever,
                            msg:child.val().messege.msg,
                            img:child.val().messege.img
                        });
                    });
                    setMesseges(msgs.reverse());
                });
        } catch (error) {
            alert(error);
        }
    },[]);

    const handleSend = () => {
        setMsgValue('');
        if(msgValue){
            senderMsg(msgValue,currentUserId,guestUserId,'')
                .then(()=>{})
                .catch((err)=>{
                    alert(err)
                });

        // guest user or receiver
            recieverMsg(msgValue,currentUserId,guestUserId,'')
            .then(()=>{})
            .catch((err)=>{
                alert(err)
            });
        }
       
    };

    // handle camera function
    const handleCamera = () => {
        alert("You can now access your camera!")
    };

    // On handle change
    const handleOnChange = (text) => {
        setMsgValue(text);
    };

    // On image tap
    const imgTap = (chatImage) => {
        navigation.navigate("ShowFullImg", { name, img: chatImage });
    };

    return(
        <SafeAreaView style={[globalStyle.flex1,{backgroundColor:'#EDBB99'}]}>
            <FlatList 
                inverted
                data={messeges}
                keyExtractor={(_,index)=>index.toString()}
                renderItem={({item})=>(
                    <ChatBox 
                        msg={item.msg}
                        userId={item.sendBy}
                        img={item.img}
                        onImgTap={()=>imgTap(item.img)}
                    />
                )}
            />
            
            {/*  send message component*/}
            <View style={styles.sendMessageContainer}>
                <InputField 
                    placeholder="Type Here..."
                    numberOfLines={10}
                    inputStyle={styles.input}
                    value={msgValue}
                    onChangeText={(text)=>handleOnChange(text)}
                />
                <View style={styles.sendBtnContainer}>
                    <MaterialCommunityIcons 
                        name="camera"
                        color={color.BLACK}
                        size={appStyle.fieldHeight}
                        onPress={()=>handleCamera()}
                    />
                    <MaterialCommunityIcons 
                        name="send-circle"
                        color={color.BLACK}
                        size={appStyle.fieldHeight}
                        onPress={()=>handleSend()}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
};

export default Chat;