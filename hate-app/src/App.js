import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.scss';
import PostList from "./components/postlist";
import EditPost from "./components/edit-post";
import CreatePost from "./components/create-post";

function App() {
  return (
    <Router>
      

      <div className="App">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <h2>Hatesome</h2>
            </div>
            <ul>
              <li><Link to="/">Posts</Link></li>
              <li><Link to="/create">Create</Link></li>
            </ul>
              
          </nav>
          <Route path="/" component={PostList}/>
          <Route path="/create" component={CreatePost}/>
          <Route path="/edit/:id" component={EditPost}/>

        </div>
      </div>
    </Router>
  );
}

export default App;
