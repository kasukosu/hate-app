import { useState } from 'react';
import React from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';

const CreatePost = () => {

    const postsRef = db.collection('posts');
    // const url = 'http://localhost:5000/api/posts';
    const [blogpost, setBlogPost] = useState({
        message:"", author:""
    })

    const addPost = async(e) => {
        e.preventDefault();

        const {uid, photoURL, displayName} = auth.currentUser;
        console.log(auth.currentUser);

        await postsRef.add({
            author: uid,
            photoURL: photoURL,
            displayName: displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            message: blogpost.message,
            hidden: false,
            votes: 0,
            comments: [{}],
        })

        setBlogPost({message:""});

        // const post = {author:blogpost.author, message: blogpost.message}
        // console.log(post);
        // if(post.message && post.message.length > 0){
        //     axios.post(url, post)
        //         .then(res=> {
        //             if(res.data){
        //                 setBlogPost({message: ""})
        //             }
        //         })
        //         .catch(err => console.log(err))
        // }else{
        //     console.log('input field required')
        // }
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
 
export default CreatePost;