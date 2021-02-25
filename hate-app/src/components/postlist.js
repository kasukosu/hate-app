import React from 'react';
import Post from './post';

import {db} from "../firebase/firebaseConfig"; 
import { useCollectionData } from 'react-firebase-hooks/firestore';


const Postlist = () => {    
    const postsRef = db.collection('posts');
    const query = postsRef.orderBy('createdAt').limit(20);
    const [posts] = useCollectionData(query, {idField: 'id'});
    return ( 
        <section className="postfeed">
            {/* {error && <div>{error}</div>}
            {isPending && <div className="loader">Loading...</div>}
            {data &&
                data.map((item) => 
                    <Post post={item} key={item._id}/>
                )
            } */}

            {posts && posts.map(post => <Post key={post.id} post={post}/> )}
        </section>
        
    );
}
 
export default Postlist;