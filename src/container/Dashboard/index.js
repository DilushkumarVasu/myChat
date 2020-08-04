import React,{ useLayoutEffect, useContext, useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, SafeAreaView} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
//import ImagePicker from 'react-native-image-picker';
import { color, globalStyle } from '../../utility';
import { LogOutUser, UpdateUser } from '../../network';
import { clearAsyncStorage } from '../../asyncStorage';
import { Store } from '../../context/store';
import { LOADING_START, LOADING_STOP } from '../../context/actions/types';
import firebase from '../../firebase/config';
import {uuid, smallDeviceHeight  } from '../../utility/constants';
import { Profile, ShowUsers, StickyHeader } from '../../component';
import { deviceHeight } from "../../utility/styleHelper/appStyle";


const Dashboard = ({navigation}) => {
   const globalState = useContext(Store);
   const {dispatchLoaderAction} = globalState;
   const [getScrollPosition,setScrollPosition] = useState(0);
   const [userDetail,setUserDetail] = useState({
        id:"",
        name:"",
        profileImage:"",
   });

   const {name,profileImage} = userDetail;
   const [allUsers,setAllUsers] = useState([]);

   useLayoutEffect(()=>{
       navigation.setOptions({
           headerRight:()=>(
               <SimpleLineIcon 
                name="logout"
                size={26}
                color={color.WHITE}
                style={{right:10}}
                onPress={()=>Alert.alert('Logout','Are you sure to log out',[
                    {
                        text:'Yes',
                        onPress:()=>logout(),
                    },
                    {
                        text:'No'
                    }
                ],{
                    cancelable:false
                })}
               />
           )
       })
   },[navigation]);

   useEffect(()=>{
       dispatchLoaderAction({
           type:LOADING_START,
       });
       try{
           firebase
            .database()
            .ref('users')
            .on('value',(dataSnapShot)=>{
                let users = [];
                let currentUser = {
                    id:'',
                    name:'',
                    profileImage:''
                };
                dataSnapShot.forEach((child)=>{
                    if(uuid === child.val().uuid){
                        currentUser.id = uuid;
                        currentUser.name = child.val().name;
                        currentUser.profileImage = child.val().profileImage;
                    }
                    else{
                        users.push({
                            id:child.val().uuid,
                            name:child.val().name,
                            profileImage:child.val().profileImage
                        });
                    }
                });
                setUserDetail(currentUser);
                setAllUsers(users);
                dispatchLoaderAction({
                    type:LOADING_STOP,
                });
            });

       }catch(error){
            dispatchLoaderAction({
                type:LOADING_STOP,
            });
            alert(error)
       }
   },[]);

   // image selecting function
//    const selectPhotoTapped = () => {
//        const option = {
//            storageOptions:{
//                skipBackup:true
//            }
//        };

//        ImagePicker.showImagePicker(option,(response)=>{
//            if(response.didCancel){
//                console.log('User cancel image picker');
//            }
//            else if(response.error){
//                console.log('Image picker error',response.error);
//            }
//            else{
//                //Base 64 , to store the image in database
//                let source = "data:image/jpeg;base64," + response.data;//this converts the image to base 64
//                dispatchLoaderAction({
//                    type:LOADING_START
//                });
//                UpdateUser(uuid,source)
//                 .then(()=>{
//                     setUserDetail({
//                         ...userDetail,
//                         profileImage: source,
//                     });
//                     dispatchLoaderAction({
//                         type:LOADING_STOP
//                     });
//                 })
//                 .catch((err)=>{
//                     dispatchLoaderAction({
//                         type:LOADING_STOP
//                     });
//                     alert(err);
//                 });
//            }
//        });
//    };

   
   
   //logout
   const logout = () =>{
       LogOutUser()
        .then(()=>{
            clearAsyncStorage()
                .then(()=>{
                    navigation.replace('Login');
                })
                .catch((err)=>{
                    alert(err)
                })
        })
        .catch((err)=>{
            alert(err)
        })
   };

   // on image tap
   const imgTap = (profileImage,name) => {
       if(!profileImage){
            navigation.navigate('ShowFullImg',{
                name,
                imgText:name.charAt(0)
            });
       }else{
            navigation.navigate('ShowFullImg',{
                name,
                img:profileImage
            }) 
       }
   }

   // on name tap function for chat module
   const nameTap = (profileImage,name,guestUserId) => {
       if(!profileImage){
           //the user does not a ProfileImage
           navigation.navigate('Chat',{
               name,
               imgText:name.charAt(0),
               guestUserId,
               currentUserId:uuid,
           });
       }
       else{
           //the user has a ProfileImage
        navigation.navigate("Chat", {
            name,
            img: profileImage,
            guestUserId,
            currentUserId: uuid,
          });
       }
   };

   // get opacity
//    const getOpacity = () =>{
//        if(deviceHeight < smallDeviceHeight){
//             return deviceHeight/4;
//        }else{
//             return deviceHeight/6;
//        }
//    };

    return(
        <View style={[globalStyle.flex1]}>
            {/* {
                getScrollPosition > getOpacity() && (
                    <StickyHeader
                        name={name}
                        img={profileImage}
                        onImgTap={()=>imgTap(profileImage,name)}
                    />
                ) 
            } */}
            <FlatList
                alwaysBounceHorizontal={false}
                data={allUsers}
                keyExtractor={(_,index)=>index.toString()}
                // onScroll={(event)=>setScrollPosition(event.nativeEvent.contentOffset.y)}
                ListHeaderComponent={
                    // <View
                    // style={{
                    //     opacity:
                    //       getScrollPosition < getOpacity()
                    //         ? (getOpacity() - getScrollPosition) / 100 
                    //         : 0,
                    //   }}
                    // >
                    <Profile
                        img={profileImage}
                        name={name}
                        //onEditImgTap={()=>selectPhotoTapped()}
                        onImgTap={()=>imgTap(profileImage,name)}
                    />
                    // </View>
                }
                renderItem={({item})=>(
                    <ShowUsers 
                        name={item.name}
                        img={item.profileImage}
                        onImgTap={()=>imgTap(item.profileImage,item.name)}
                        onNameTap={()=>nameTap(item.profileImage,item.name,item.id)}
                    />
                )} 
            />
        </View>
    )
}

export default Dashboard;
