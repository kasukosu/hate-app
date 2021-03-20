import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { auth, firebase, db } from '../firebase/firebaseConfig';
import {motion} from 'framer-motion';
const CreatePost = (props) => {
    const postsRef = db.collection('posts');
    const [blogpost, setBlogPost] = useState({
        message:"", author:""
    })
    const user = auth.currentUser;


    const addPost = async(e) => {
        e.preventDefault();
        if(user!=null){
            const {uid, photoURL, displayName} = user;
            await postsRef.add({
                author: uid,
                photoURL: photoURL,
                displayName: displayName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                message: blogpost.message,
                hidden: false,
                votes: [{}],
                commentCount: 0,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
            })

            setBlogPost({message:""});
        }

    }

    const changeHandler = (e) => {
        const value = e.target.value;

        setBlogPost({
          ...blogpost,
          [e.target.name]: value
        });
    }

    return (
        <section className="create-post">
            {user ? null : 
                    <div onClick={()=>{props.setShowSignIn(true)}} className="loginFirst">
                        <p>😈 Login to start hating! 😈</p>
                    </div>
                }
            <form className="creator" onSubmit={addPost}>
                
                <div className="input-box">
                    <textarea placeholder="What did you hate today?" type="text" name="message" required value={blogpost.message} onChange={changeHandler}/>
                    <motion.button whileHover={{backgroundColor: 'rgb(4,174,79)'}}  whileTap={{scale: 0.9 }} transition={{duration:0.15}} type="submit" className="send">
                        Post  <FontAwesomeIcon icon={faPaperPlane}/>
                    </motion.button>
                </div>

            </form>
        </section>
    );

}

export default CreatePost;