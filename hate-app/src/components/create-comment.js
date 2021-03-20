import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
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
        if(user!=null&&comment.message.length>0){
            
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
                    <textarea placeholder="I hate this" type="text" name="message" required value={comment.message} onChange={changeHandler}/>
                    <motion.button whileHover={{backgroundColor: 'rgb(32,105,224)'  }} whileTap={{ scale: 0.9 }} onClick={addComment} type="submit" className="send">
                        Comment  <FontAwesomeIcon icon={faPaperPlane}/>
                    </motion.button>
                </div>
            </motion.form>
        </section>
    );
}

export default CreateComment;