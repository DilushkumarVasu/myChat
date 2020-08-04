import { LOADING_START,LOADING_STOP } from '../../actions/types';

const intialState = {
    loading:false,
};

/*reducer in redux--->A reducer is a pure function that takes 
the previous state and an action as arguments and returns a new state. */

const loader = (state = intialState, action)=>{
    const {type,payload} = action;
    switch(type){
        case LOADING_START:
            return {
                loading:true
            };
        case LOADING_STOP:
            return {
                loading:false
            };
        default:
            return state;
    }
};

export default loader;