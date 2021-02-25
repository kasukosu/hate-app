import React from 'react';
import {auth, firebase} from "../../firebase/firebaseConfig"; 


function SignIn() {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  return ( 
  
      <button onClick={signInWithGoogle}>Sign in with google</button>
   );
  }
  
function SignOut() {
    return auth.currentUser && ( 
        <button onClick={() => auth.signOut()}>Sign out</button>
    );
}
export {SignIn, SignOut};