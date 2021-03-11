import React from 'react';
import Creator from './postcreator';
import {SignIn} from './login/login';
const CreatePost = (props) => {
    const user = props.user;
    return (
        <div>
            <Creator/>
        </div>
    );
}

export default CreatePost;