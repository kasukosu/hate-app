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
import Toast from './components/toast';
import { ToastContext } from './components/ToastContext';
import PostEditor from './components/post-editor';


const navVariants = {
  hidden : {
    opacity: 0,
    height: 0,
  },
  visible : {
    opacity: 1,
    height: 40,
  }
}

const modalVariants = {
  hidden: {
      opacity: 0,

  },
  visible:{
      opacity:1,
      y: 0,
  },
  exit:{
      opacity: 0,
      transition:{
          duration:0.25,
          ease: 'easeInOut',
      }
  }
}

function App() {


  const [user] = useAuthState(auth);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateNewPost, setShowCreateNewPost] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [newPostData, setNewPostData] = useState(null);

  console.log(newPostData)
  useEffect(() =>{
    if(user){
      const userRef = db.collection('users');
      userRef.doc(user.uid).get().then((doc) => {
        if (doc.exists) {
            setPhotoURL(doc.data().photoURL);

        } else {
            // doc.data() will be undefined in this case
            setPhotoURL("Not logged in");
        };
        setShowNav(true)

    })
  }
  console.log("hello")


  },[user]);


const location = useLocation();

  return (
      <div className="App">

        <section className="container">
          <nav className="navbar">
            <AnimatePresence>
              {user && photoURL && showNav ?

                <motion.div variants={navVariants} initial="hidden" animate="visible" className="nav-grid">

                  {user ?<div><SignOut/></div> : null}
                  <div className="logo">
                    <Link to="/"><h1>Hatesome</h1></Link>
                  </div>
                  {photoURL &&
                  <Link to={`/profile/${user.uid}`}>
                      <img src={photoURL} alt="Profile Pic"/>
                  </Link>
                }
                </motion.div> :
                <motion.div variants={navVariants} initial="hidden" animate="visible" className="nav-grid">
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
          <ToastContext.Provider value={{ toastValue :[showToast, setShowToast], newPostValue: [newPostData, setNewPostData] }}>
            <AnimatePresence>
              <Switch location={location} key={location.pathname}>
                  <Route exact path="/" render={(props) => ( <PostList {...props} showCreateNewPost={showCreateNewPost} setShowSignIn={setShowSignIn} />)} />
                  <Route path="/post/:id" render={(props) => ( <FullPost {...props} setShowSignIn={setShowSignIn} />)} />
                  <Route path="/profile/:id" render={(props) =>( <Profile {...props} user={user} setShowSignIn={setShowSignIn} /> )} />
              </Switch>
            </AnimatePresence>
          </ToastContext.Provider>

        </section>
        <AnimatePresence>
          {showToast.show ? <Toast message={showToast.message}/>:null}
        </AnimatePresence>

        <AnimatePresence>
          {newPostData &&
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="modal" >
              <PostEditor setNewPostData={setNewPostData} postData={newPostData} />
            </motion.div>
          }
        </AnimatePresence>

      </div>
  );
}



export default App;
