
//An asynchronous, unencrypted, persistent, key-value storage system for React Native.

/*AsyncStorage can only store string data, so in order to store object data you need to serialize it first. 
For data that can be serialized to JSON you can use JSON.stringify() 
when saving the data and JSON.parse() when loading the data.*/

import AsyncStorage from '@react-native-community/async-storage';

export const keys = {
    uuid:'uuid',
};

//Storing data
const setAsyncStorage = async(key,item) => {
    try{
        await AsyncStorage.setItem(key,item);
    }catch(error){
        console.log(error);
    }
};

//Reading data
const getAsyncStorage = async(key) => {
    try{
       const value = await AsyncStorage.getItem(key);
       if(value){
           return value;
       }
       else{
           return null;
       }
    }catch(error){
        console.log(error);
        return null;
    }
};

const clearAsyncStorage = async() => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log(error);
    }
};

export {setAsyncStorage,getAsyncStorage,clearAsyncStorage};