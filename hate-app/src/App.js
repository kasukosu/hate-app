import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import './App.scss';
import PostList from "./components/postlist";
import FullPost from "./components/full-post";
import CreatePost from "./components/create-post";
import Profile from "./components/profile";
import {SignOut, SignIn} from "./components/login/login"

import {auth} from "./firebase/firebaseConfig";
import { useAuthState } from 'react-firebase-hooks/auth';


function App() {


const [user] = useAuthState(auth);
const [showSignIn, setShowSignIn] = useState(false);



  return (
    <Router>
      <div className="App">

        <section className="container">
          <nav className="navbar">
            <div className="logo">
              <Link to="/"><h1>Hatesome</h1></Link>
            </div>
            <ul>
              {user ? <li><Link to="/create">Create</Link></li> : <li onClick={()=>setShowSignIn(true)}>SignIn</li>}
              <li>{user ? <SignOut/>:""}</li>

            </ul>

            <li>{user ? <Link to={`/profile/${user.uid}`}><img src={user.photoURL} alt=""/></Link>:""}</li>

          </nav>
          {showSignIn && <SignIn setShowSignIn={setShowSignIn}/>}
          <Switch>
            <Route path="/create" render={(props) =>( <CreatePost {...props} user={user} />)} />
            <Route exact path="/" render={(props) => ( <PostList {...props} setShowSignIn={setShowSignIn} />)} />
            <Route path="/post/:id" component={FullPost}/>
            <Route path="/profile/:id" render={(props) =>( <Profile {...props} user={user} /> )} />
          </Switch>
        </section>

      </div>
    </Router>
  );
}



export default App;
