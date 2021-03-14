import React from 'react';
import {auth, firebase, db} from "../../firebase/firebaseConfig";
import { useAuthState, useCollectionData } from 'react-firebase-hooks/auth';
import {AnimatePresence, motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { fa } from '@fortawesome/free-solid-svg-icons';

function SignIn(props) {

  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
      .then((results=> {
        let user = auth.currentUser;
        if(user!=null){
          if(!checkUserExist(user)){
            addUser();
          }
          props.setShowSignIn(false)
        }
      }));
  }

  const addUser = async(e) => {
    const userRef = db.collection('users');
    const {uid, photoURL, displayName} = auth.currentUser;
    console.log("Adding new user")
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

  const checkUserExist = async(user) => {
    if(user.uid != null){
      const userRef = db.collection('users').doc(user.uid);
      await userRef.get().then((user) => {
        if(user.exists){
          //continue if user already exists
          console.log("User Exists:", user.data());
          return true;

        }
        else{
          //create profile ifit doesnt exist
          console.log("User doesn't exist:", user.data());
          return false;
        }
      });
    }

  }
  return (
      <motion.div initial={{y: -40, opacity: 0}} animate={{ y: 0, opacity: 1}} exit={{opacity: 0}} className="modal">
        <section className="modal-main">
            <motion.div whileHover={{scale: 1.1, backgroundColor: 'rgb(104,84,134)', opacity:0.9}} transition={{type:'spring'}} className="close-btn" onClick={()=> props.setShowSignIn(false)}>
              <FontAwesomeIcon icon={faTimes}/>
            </motion.div>
            <h1>Login to hatesome!</h1>
            <p>Login with your Google account to start hating!</p>
            <div className="btn-group">
              <motion.button whileHover={{backgroundColor: 'rgb(4,174,79)'}} transition={{duration:0.1}} className="login" type="submit"  onClick={signInWithGoogle}>Sign in</motion.button>
            </div>
          </section>
      </motion.div>
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