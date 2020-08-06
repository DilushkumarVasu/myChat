import firebase from '../../firebase/config';

export const AddUser = async(name,email,uid,profileImage) => {
    try {
        return await firebase
            .database()
            .ref('users/'+uid)
            .set({
                name:name,
                email:email,
                uuid:uid,
                profileImage:profileImage
            });
    } catch (error) {
        return error;
    }
};

export const UpdateUser = async(uuid,imgSource) => {
    try {
        return await firebase
            .database().ref('users/'+uuid)
            .update({
                profileImage:imgSource,
            });
    } catch (error) {
        return error;
    }
};
