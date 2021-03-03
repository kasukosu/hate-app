import React from 'react';
import {auth, firebase, db} from "../../firebase/firebaseConfig"; 
import { useAuthState, useCollectionData } from 'react-firebase-hooks/auth';


function SignIn() {

  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
      .then((results=> {
        let user = auth.currentUser;   
     
        if(user!=null){
          if(!checkUserExist(user)){
            addUser();
          }
        }
      }));
      
  }

  const addUser = async(e) => {
    const userRef = db.collection('users');
    const {uid, photoURL, displayName} = auth.currentUser;

    await userRef.doc(uid).set({
        user_id: uid,
        photoURL: photoURL,
        displayName: displayName,
        nickname: "",
        bio: "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        private: false,
        posts: [{}],
        votes: [{}],
        shares: [{}],
        comments: [{}],
        followers: [{}],
        follows: [{}],
    })    

  }

  const checkUserExist = (user) => {
    if(user.uid != null){

      const userRef = db.collection('users').doc(user.uid);
      userRef.get().then((user) => {
        if(user.exists){
          //continue if user already exists
          return true;

        }
        else{

          //create profile ifit doesnt exist
          return false;
        }
      });
    }
    
  }
  return ( 
  
      <button onClick={signInWithGoogle}>Sign in</button>
   );
  }
  
function SignOut() {


    const handleLogOut = () => {
      auth.signOut();
      document.location.href="/";

    }
    return auth.currentUser && ( 
        <button onClick={handleLogOut}>Sign out</button>
    );
}
export {SignIn, SignOut};