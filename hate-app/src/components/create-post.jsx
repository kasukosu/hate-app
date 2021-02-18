import { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePost = () => {
    
    const [blogpost, setBlogPost] = useState({
        message:"", author:""
    })

    const addPost = () => {
        const blogpost = {author:blogpost.author, message: blogpost.message}

        if(blogpost.message && blogpost.message > 0){
            axios.post('./api/posts', blogpost)
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

    const handleChange = (e) => {
        setBlogPost({
          message: e.target.value
        })
    }

    
    return ( 
        <section className="create-post">
            <h1>create-post</h1>
            <form onSubmit={this.onFormSubmit}>
                <input type="text"/>
                <button type="submit">Submit</button>
            </form>
        </section>
    );
}
 
export default CreatePost;