import axios from 'axios';
import { useState, useEffect } from 'react';
import useFetch from './useFetch';
import Post from './post';
const Postlist = () => {
    const url = 'http://localhost:5000/api/posts';
    
    const {data, isPending, error}  = useFetch(url)
    
    
    const deletePost = (id) => {
        axios.delete(`/api/posts/${id}`)
            .then(res => {
                if(res.data){
                    
                }
            })
            .catch(err => console.log(err))
    }

    


    return ( 
        <section className="postfeed">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {data &&
                data.map((item) => 
                    <Post post={item} key={item.id}/>
                )
            }
        </section>
    );
}
 
export default Postlist;