import React, {useState} from 'react';
import { useLocation, Route, Link, Switch } from "react-router-dom";
import './App.scss';
import PostList from "./components/postlist";
import FullPost from "./components/full-post";
import Profile from "./components/profile";
import {SignOut, SignIn} from "./components/login/login"
import {motion, AnimatePresence} from 'framer-motion';
import {auth} from "./firebase/firebaseConfig";
import { useAuthState } from 'react-firebase-hooks/auth';


function App() {


const [user] = useAuthState(auth);
const [showSignIn, setShowSignIn] = useState(false);
const [showCreateNewPost, setShowCreateNewPost] = useState(false);



const location = useLocation();

  return (
      <div className="App">

        <section className="container">
          <nav className="navbar">
            
            <ul>
              <li className="logo">
                <Link to="/"><h1>Hatesome</h1></Link>
              </li>
              {user ? null : <li onClick={()=>setShowSignIn(true)}>SignIn</li>}
              {user ? <Link to="/"><li onClick={()=>setShowCreateNewPost(true)}>Add new</li></Link> : null}
              <li>{user ? <SignOut/>:""}</li>
              {user && 
              <Link to={`/profile/${user.uid}`}>
                <li>
                  <img src={user.photoURL} alt="Profile Pic"/>
                </li>
              </Link> 
            }
            </ul>
            
            

          </nav>
          {showSignIn && <SignIn setShowSignIn={setShowSignIn}/>}
          <AnimatePresence>
            <Switch location={location} key={location.pathname}>
              <Route exact path="/" render={(props) => ( <PostList {...props} showCreateNewPost={showCreateNewPost} setShowSignIn={setShowSignIn} />)} />
              <Route path="/post/:id" render={(props) => ( <FullPost {...props} setShowSignIn={setShowSignIn} />)} />
              <Route path="/profile/:id" render={(props) =>( <Profile {...props} user={user} /> )} />
            </Switch>
          </AnimatePresence>
        </section>

      </div>
  );
}



export default App;
