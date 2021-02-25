import React from 'react';
import Creator from './creator';
import {SignIn} from './login/login';
const CreatePost = (props) => {
    const user = props.user;
    return (
        <div>
            {user ? <Creator/> : <SignIn/>}
        </div>
    );
}
 
export default CreatePost;