import React,{ useLayoutEffect, useContext, useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, SafeAreaView} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
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
   const selectPhotoTapped = async() => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      try {
        // only if user allows permission to camera roll
        if (cameraRollPerm === 'granted') {
          console.log('choosing image granted...');
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
  
            if(result.cancelled){
                console.log('User cancel image picker');
            }
            else if(result.error){
                console.log('Image picker error',response.error);
            }
            else{
                let source = result.uri;
                dispatchLoaderAction({
                    type:LOADING_START
                });
                UpdateUser(uuid,source)
                .then(()=>{
                    setUserDetail({
                        ...userDetail,
                        profileImage: source,
                    });
                    dispatchLoaderAction({
                        type:LOADING_STOP
                    });
                })
                .catch((err)=>{
                    dispatchLoaderAction({
                        type:LOADING_STOP
                    });
                    alert(err);
                });
            }
        }
      } catch (err) {
        console.log('onImageUpload error:' + err.message);
        alert('Upload image error:' + err.message);
      }
   };

   
   
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


    return(
        <View style={[globalStyle.flex1]}>
            <FlatList
                alwaysBounceHorizontal={false}
                data={allUsers}
                keyExtractor={(_,index)=>index.toString()}
                ListHeaderComponent={
                    <Profile
                        img={profileImage}
                        name={name}
                        onEditImgTap={()=>selectPhotoTapped()}
                        onImgTap={()=>imgTap(profileImage,name)}
                    />
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
