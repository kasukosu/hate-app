import { useState } from 'react';
import React from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';

const PostCreator = () => {

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
                recentComments: [{}],
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
            <h1>So...    what do you hate today?</h1>
            <form className="creator" onSubmit={addPost}>
                <div className="input-box">
                    <label htmlFor="message">Message</label>
                    <textarea type="text" name="message" required value={blogpost.message} onChange={changeHandler}/>
                </div>

                <button onClick={addPost} type="submit">Submit</button>
            </form>
        </section>
    );
}
 
export default PostCreator;