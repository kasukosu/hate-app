import React  from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import './App.scss';
import PostList from "./components/postlist";
import EditPost from "./components/edit-post";
import CreatePost from "./components/create-post";
import Profile from "./components/profile";
import {SignOut, SignIn} from "./components/login/login"

import {auth} from "./firebase/firebaseConfig"; 
import { useAuthState } from 'react-firebase-hooks/auth';


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
              <li>{user ? <Link to="/create">Create</Link> : <SignIn/>}</li>
              <li>{user ? <SignOut/>:""}</li>
              {/* <li>{user ? <Link to={`/profile/${user.uid}`}>Profile</Link>:""}</li> */}

            </ul>
            <li>{user ? <Link to={`/profile/${user.uid}`}><img src={user.photoURL} alt=""/></Link>:""}</li>

          </nav>
          <Switch>
            <Route path="/create" render={(props) =>( <CreatePost {...props} user={user} />)} /> 
            <Route exact path="/" component={PostList}/>
            <Route path="/edit/:id" component={EditPost}/> 
            <Route path="/profile/:id" render={(props) =>( <Profile {...props} user={user} /> )} />
          </Switch>
        </section>

       
      </div>
    </Router>
  );
}



export default App;
