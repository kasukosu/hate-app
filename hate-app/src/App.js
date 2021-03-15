import React, {useState, useEffect} from 'react';
import { useLocation, Route, Link, Switch } from "react-router-dom";
import './App.scss';
import PostList from "./components/postlist";
import FullPost from "./components/full-post";
import Profile from "./components/profile";
import {SignOut, SignIn} from "./components/login/login";
import { auth, db } from './firebase/firebaseConfig';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {motion, AnimatePresence} from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import {Toast} from './popup-toast';

const navVariants = {
  hidden : {
    opacity: 0,
  },
  visible : {
    opacity: 1,
  }
}

function App() {


  const [user] = useAuthState(auth);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateNewPost, setShowCreateNewPost] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() =>{
    if(user){
      const userRef = db.collection('users');
      userRef.doc(user.uid).get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            setPhotoURL(doc.data().photoURL); 

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        };
        
    })
  }
    
  },[user]);


const location = useLocation();

  return (
      <div className="App">

        <section className="container">
          <nav className="navbar">
            <AnimatePresence>
              {user ?

                <motion.div variants="navVariants" initial="hidden" animate="visible" className="nav-grid">
                  <div className="logo">
                    <Link to="/"><h1>Hatesome</h1></Link>
                  </div>
                  {user ?<div><SignOut/></div> : null}
                  {photoURL && 
                  <Link to={`/profile/${user.uid}`}>
                      <img src={photoURL} alt="Profile Pic"/>
                  </Link> 
                }
                </motion.div> : null
              }
              {user ? null :
                <motion.div variants="navVariants" initial="hidden" animate="visible" className="nav-grid">
                    <div className="logo">
                      <Link to="/"><h1>Hatesome</h1></Link>
                    </div>
                </motion.div>
              }
            </AnimatePresence>
          </nav>

          <AnimatePresence>
            {showSignIn && <SignIn setShowSignIn={setShowSignIn}/>}
          </AnimatePresence>
              
          <AnimatePresence>
            <Switch location={location} key={location.pathname}>
              <Route exact path="/" render={(props) => ( <PostList {...props} showCreateNewPost={showCreateNewPost} setShowSignIn={setShowSignIn} />)} />
              <Route path="/post/:id" render={(props) => ( <FullPost {...props} setShowSignIn={setShowSignIn} />)} />
              <Route path="/profile/:id" render={(props) =>( <Profile {...props} user={user} setShowSignIn={setShowSignIn} /> )} />
            </Switch>
          </AnimatePresence>
        </section>

      </div>
  );
}



export default App;
