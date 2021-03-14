import React from 'react';
import {auth, firebase, db} from "../../firebase/firebaseConfig";
import { motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function SignIn(props) {

  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
      .then((results=> {
        let user = auth.currentUser;
        if(user!=null){
          
          checkUserExist(user).then((user) => {
            if(user.exists){
              //continue if user already exists
              console.log("User Exists:", user.data());
              props.setShowSignIn(false)
              return;
    
            }
            else{
              //create profile ifit doesnt exist
              console.log("User doesn't exist:", user.data());
              addUser().then((event)=>{
                window.location.reload();
                props.setShowSignIn(false)
                
              });
              return;
            }
          })
          console.log(user);
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
      const userRef = db.collection('users').doc(user.uid);
      return await userRef.get();
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