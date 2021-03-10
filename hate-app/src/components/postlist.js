import React from 'react';
import Post from './post';
import {db} from "../firebase/firebaseConfig";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {motion} from 'framer-motion';

const Postlist = () => {
    const postsRef = db.collection('posts');
    const query = postsRef.orderBy('createdAt','desc').limit(20);
    const [posts] = useCollectionData(query, {idField: 'id'});
    return (
        <>
        {posts &&
            <motion.section initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.2, delay: 0.5}} className="postfeed">
                {posts && posts.map(post =>
                    <Post key={post.id} post={post}/>
                )}
            </motion.section>

        }
        </>
    );
}

export default Postlist;