import React from 'react';
import { db } from '../firebase/firebaseConfig';
import Creator from './creator';
import {SignIn, SignOut} from './login/login';
const CreatePost = (props) => {
    console.log(props);
    const postsRef = db.collection('posts');    
    const user = props.user;

    console.log(user);
    return ( 
        <div>
            {user ? <Creator/> : <SignIn/>}
        </div>
    );
}
 
export default CreatePost;