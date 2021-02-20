import { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePost = () => {
    
    const [blogpost, setBlogPost] = useState({
        message:"", author:""
    })

    const addPost = (e) => {
        e.preventDefault();
        const post = {author:blogpost.author, message: blogpost.message}

        if(post.message && post.message.length > 0){
            axios.post('./api/posts', post)
                .then(res=> {
                    if(res.data){
                        setBlogPost({message: ""})
                    }
                })
                .catch(err => console.log(err))
        }else{
            console.log('input field required')
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
            <form onSubmit={addPost}>
                <div className="input-box">
                    <label htmlFor="author">Hatertag</label>
                    <input type="text" name="author" required value={blogpost.author} onChange={changeHandler}/>
                </div>
                <div className="input-box">
                    <label htmlFor="message">Message</label>
                    <textarea type="text" name="message" required value={blogpost.message} onChange={changeHandler}/>
                </div>

                <button onClick={addPost} type="submit">Submit</button>
                <p>{blogpost.message}</p>
                <p>{blogpost.author}</p>

            </form>
        </section>
    );
}
 
export default CreatePost;