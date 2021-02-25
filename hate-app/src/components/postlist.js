import axios from 'axios';
import React from 'react';
import useFetch from './useFetch';
import Post from './post';

import {db} from "../firebase/firebaseConfig"; 
import { useCollectionData } from 'react-firebase-hooks/firestore';


const Postlist = () => {    
    const postsRef = db.collection('posts');
    const query = postsRef.orderBy('createdAt').limit(20);
    const [posts] = useCollectionData(query, {idField: 'id'});
    // console.log(useCollectionData(query, {idField: 'id'}));

    
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
            {/* {error && <div>{error}</div>}
            {isPending && <div className="loader">Loading...</div>}
            {data &&
                data.map((item) => 
                    <Post post={item} key={item._id}/>
                )
            } */}

            {posts && posts.map(post => <Post key={post.id} post={post}/>)}
        </section>
        
    );
}
 
export default Postlist;