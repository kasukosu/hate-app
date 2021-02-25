import axios from 'axios';
import React from 'react';
import useFetch from './useFetch';
import Post from './post';

import {auth, firebase, db} from "../firebase/firebaseConfig"; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


const Postlist = () => {
    const url = 'http://localhost:5000/api/posts';
    
    const {data, isPending, error}  = useFetch(url)
    
    const postsRef = db.collection('posts');
    const query = postsRef.orderBy('createdAt').limit(10);
    const [posts] = useCollectionData(query, {idField: 'id'});
    console.log(useCollectionData(query, {idField: 'id'}));

    
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