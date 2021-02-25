import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.scss';

import PostList from "./components/postlist";
import EditPost from "./components/edit-post";
import CreatePost from "./components/create-post";

import {auth, firebase} from "./firebase/firebaseConfig"; 

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function App() {

const [user] = useAuthState(auth);

  return (
    <Router>
      <div className="App">
        
        <section className="container">
          <nav className="navbar">
            <div className="logo">
              <h1>Hatesome</h1>
            </div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/create">Create</Link></li>
            </ul>
          </nav>
          {user ?  <Route path="/" component={PostList}/>: <SignIn/>}
          <Route path="/create" component={CreatePost}/>

         <Route path="/edit/:id" component={EditPost}/> 

        </section>

        <section className="signin">
        </section>
      </div>
    </Router>
  );
}

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

export default App;
