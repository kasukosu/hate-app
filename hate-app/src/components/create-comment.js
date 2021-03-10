import React from 'react';
import CommentCreator from './commentcreator';
import {SignIn} from './login/login';

const CreateComment = (props) => {
    const {user, post_id} = props;
    return (
        <>
            {user ? <CommentCreator post_id={post_id}/> : <SignIn/>}
        </>
    );
}

export default CreateComment;