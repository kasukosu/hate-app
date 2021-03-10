import React from 'react';
import CommentCreator from './commentcreator';
import {SignIn} from './login/login';
import {TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import styled from 'styled-components';

const animate = styled.section`

    .transition-enter {
        opacity: 0.01;
        transform: translate(0, -10px);
    }
    .transition-enter-active {
        opacity: 1;
        transform: translate(0, 0);
        transition: all 300ms ease-in;
    }
    .transition-exit {
        opacity: 1;
        transform: translate(0, 0);
    }
    .transition-exit-active {
        opacity: 0.01;
        transform: translate(0, 10px);
        transition: all 300ms ease-in;
    }
`;

const CreateComment = (props) => {
    const {user, post_id} = props;
    return (
        <>
            {user ? <CommentCreator post_id={post_id}/> : <SignIn/>}
        </>
    );
}

export default CreateComment;