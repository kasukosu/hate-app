import { useState } from 'react';
import React from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';

const Creator = () => {

    const postsRef = db.collection('posts');
    const [blogpost, setBlogPost] = useState({
        message:"", author:""
    })

    const addPost = async(e) => {
        e.preventDefault();

        const {uid, photoURL, displayName} = auth.currentUser;
        await postsRef.add({
            author: uid,
            photoURL: photoURL,
            displayName: displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            message: blogpost.message,
            hidden: false,
            votes: [{}],
            comments: [{}],
        })

        setBlogPost({message:""});
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
            <form onSubmit={addPost}>
                <div className="input-box">
                    <label htmlFor="message">Message</label>
                    <textarea type="text" name="message" required value={blogpost.message} onChange={changeHandler}/>
                </div>

                <button onClick={addPost} type="submit">Submit</button>
            </form>
        </section>
    );
}
 
export default Creator;