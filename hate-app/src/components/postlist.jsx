import axios from 'axios';
import { useState, useEffect } from 'react';
const Postlist = () => {
    
    const [postList, setPostList] = useState([]);

    const getBlogPosts = () => {
        axios.get('/api/posts')
            .then(res => {
                if(res.data){
                    console.log(res.data);
                    setPostList(res.data);
                }
            })
    }
    
    const deletePost = (id) => {
        axios.delete(`/api/posts/${id}`)
            .then(res => {
                if(res.data){
                    getBlogPosts();
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(()=> {
        getBlogPosts();
    },[])


    return ( 
        <section className="postfeed">
            {
                postList.map(item => 
                    <div>
                        {item.message} 
                    
                    </div>
                )
            }
        </section>
    );
}
 
export default Postlist;