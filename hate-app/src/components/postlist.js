import React from 'react';
import Post from './post';
import {db} from "../firebase/firebaseConfig";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {motion} from 'framer-motion';

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible:{
        opacity:1,

        transition:{
            duration:0.2,
            when: "beforeChildren"
        }
    }
}

const Postlist = (props) => {
    const postsRef = db.collection('posts');
    const query = postsRef.orderBy('createdAt','desc').limit(20);
    const [posts] = useCollectionData(query, {idField: 'id'});
    return (
        <>
        {posts &&
            <motion.section variants={containerVariants} initial="hidden" animate="visible"  className="postfeed">
                {posts && posts.map(post =>
                    <Post key={post.id} setShowSignIn={props.setShowSignIn} showRecentComments={true} post={post}/>
                )}
            </motion.section>

        }
        </>
    );
}

export default Postlist;