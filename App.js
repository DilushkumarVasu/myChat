import React,{Fragment} from 'react';
import Nav from './src/navigation';
import { Loader } from './src/component';
import { StoreProvider } from './src/context/store';

/*Fragment -->React Fragment helps in returning multiple elements. T
he other alternative is to use a html element like div to wrap them. 
But using extra html node can cause some semantic issues.*/

function App(){
  return(
    <StoreProvider>
      <Nav />
      <Loader/>
    </StoreProvider>
    
  )
}

export default App;



