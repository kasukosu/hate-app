import React from 'react';
import {auth, firebase, db} from "../../firebase/firebaseConfig";
import { useAuthState, useCollectionData } from 'react-firebase-hooks/auth';
import {motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';


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
    <motion.div initial={{opacity: 0.2}} animate={{opacity: 1}} className="modal">
      <section className="modal-main">
          <motion.div whileHover={{scale: 1.1, backgroundColor: 'darkslateblue', opacity:0.9}} transition={{type:'spring'}} className="close-btn" onClick={()=> props.setShowSignIn(false)}>
            <FontAwesomeIcon icon={faTimes}/>
          </motion.div>
          <h1>Login to hatesome!</h1>
          <p>Login with your Google account</p>
          <div className="btn-group">
            <button className="login" onClick={signInWithGoogle}>Sign in</button>
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