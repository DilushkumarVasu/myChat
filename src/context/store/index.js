import React,{useReducer} from 'react';
import { Loader } from '../reducers';

export const Store = React.createContext();

const dispatch = {};

export function StoreProvider(props) {
    // all reducers
    const [mapLoaderState, dispatchLoaderAction] = useReducer(Loader, dispatch);
  
    // values of all reducers
    const loaderValue = {mapLoaderState, dispatchLoaderAction};
  
    // combine all value in a single variable
    const value = {    
      ...loaderValue,
    };
  
    // * STORE
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
  