import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';


import './App.scss';
import PostList from "./components/postlist";
import EditPost from "./components/edit-post";
import CreatePost from "./components/create-post";

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
              <li><Link to="/create">Create</Link></li>
            </ul>
          </nav>
          <Route path="/create" render={(user) =>( <CreatePost {...user} user={user} />)} /> 
          <Route path="/" component={PostList}/>
          <Route path="/edit/:id" component={EditPost}/> 

        </section>

       
      </div>
    </Router>
  );
}



export default App;
