import React  from 'react';
import {motion} from 'framer-motion';
import { useState } from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const innerVariants = {
    hidden: {
        scale: 0.9,
        y: -40,
        opacity: 0,

    },
    visible:{
        scale: 1,
        opacity:1,
        y: 0,
    },
    exit:{
        opacity: 0,
        scale: 0.8,
        y: 80,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
}

const PostEditor = (props) => {
    const [newPostData, setNewPostData] = useState({
        message:props.postData.post.message,
    });

    const updatePost = async(e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if(user!=null){
            const {uid} = user;

            if(uid===props.postData.post.author){
                const postRef = db.collection("posts").doc(props.postData.post.id);
                await postRef.update({
                    message: newPostData.message,
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }else{
                console.log("No rights to edit other peoples posts");

            }
            props.setNewPostData(false)
        }

    }

    const changeHandler = (e) => {
        const value = e.target.value;
        setNewPostData({
          ...newPostData,
          [e.target.name]: value
        });
    }
    return (
        <>
            <motion.section variants={innerVariants} initial="hidden" animate="visible" exit="exit" className="modal-main">
                <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{type:'tween'}} className="close-btn" onClick={()=> props.setNewPostData(false)}>
                    <FontAwesomeIcon icon={faTimes}/>
                </motion.div>
                <div className="modal-grid">
                    <h1>Edit your post</h1>
                    <form action="">
                        <div className="input-box">
                            <textarea value={newPostData.message} name="message" onChange={changeHandler}></textarea>
                            <motion.button whileHover={{backgroundColor: 'rgb(4,174,79)'}} transition={{duration:0.15}} onClick={updatePost} type="submit" className="send">Save <FontAwesomeIcon icon={faCheck}/></motion.button>
                        </div>
                    </form>
                </div>
            </motion.section>
        </>
     );
}

export default PostEditor;