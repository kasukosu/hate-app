import React, { useState } from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';
import {motion} from 'framer-motion';
const CreatePost = (props) => {
    const postsRef = db.collection('posts');
    const [blogpost, setBlogPost] = useState({
        message:"", author:""
    })


    const addPost = async(e) => {
        e.preventDefault();
        const user = auth.currentUser;
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
            <form className="creator" onSubmit={addPost}>
                <div className="input-box">
                    <textarea placeholder="What do you hate today?" type="text" name="message" required value={blogpost.message} onChange={changeHandler}/>
                </div>

                <motion.button whileHover={{backgroundColor: 'rgb(104,84,134)'}} transition={{duration:0.1}} onClick={addPost} type="submit">Submit</motion.button>
            </form>
        </section>
    );

}

export default CreatePost;