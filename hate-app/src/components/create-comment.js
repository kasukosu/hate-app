import React from 'react';
import {SignIn} from './login/login';
import { useState } from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';
import {motion} from 'framer-motion';

const CreateComment = (props) => {
    const {post_id} = props;

    return (
        <>
            <CommentCreator post_id={post_id}/>
        </>
    );
}

const CommentCreator = (props) => {

    const {post_id} = props;
    const postsRef = db.collection('posts').doc(post_id).collection('comments');
    const [comment, setComment] = useState({
        message:"", author:""
    })


    const addComment = async(e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(user!=null){
            const {uid, photoURL, displayName} = user;
            await postsRef.add({
                author: uid,
                post_id: post_id,
                photoURL: photoURL,
                displayName: displayName,
                message: comment.message,
                hidden: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                votes: [{}],
            })


            setComment({message:""});
        }

    }

    const changeHandler = (e) => {
        const value = e.target.value;

        setComment({
          ...comment,
          [e.target.name]: value
        });
    }

    return (
        <section className="create-comment">
            <motion.form  id="createcomment" onSubmit={addComment}>
                <div className="input-box">
                    <textarea placeholder="I hate this so much.." type="text" name="message" required value={comment.message} onChange={changeHandler}/>
                </div>
                <input type="submit" style={{display: 'none'}}/>
                <button onClick={addComment} type="submit">Submit</button>
            </motion.form>
        </section>
    );
}

export default CreateComment;