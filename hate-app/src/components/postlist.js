import React from 'react';
import Post from './post';
import {db} from "../firebase/firebaseConfig";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {motion, AnimatePresence} from 'framer-motion';
import CreatePost from "./create-post";

const containerVariants = {
    hidden: {
        opacity: 0,
        y: -50,
        scale:0.9,
    },
    visible:{
        opacity:1,
        scale:1,
        y: 0,
        transition:{
            delay: 0.2,
            duration:0.3,
        }
    },
    exit:{
        y: 40,
        scale: 0.8,
        opacity: 0,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
}

const inputContainerVariants = {
    hidden: {
        height: 0,
    },
    visible:{
        height: 160,
        transition:{
            duration:0.2,

        }
    },
    exit:{
        y: -50,
        scale: 0.8,
        opacity: 0,
        transition:{
            ease: 'easeInOut',
        }
    }
}

const Postlist = (props) => {
    const postsRef = db.collection('posts');
    const query = postsRef.orderBy('createdAt','desc').limit(20);
    const [posts] = useCollectionData(query, {idField: 'id'});

    console.log(props)
    return (
        <>
            {props.showCreateNewPost &&
                <motion.div variants={inputContainerVariants} initial="hidden" animate="visible" exit="exit">
                    <CreatePost/>
                </motion.div>
            }

            {posts &&
                <motion.section variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="feed">
                    {posts && posts.map(post =>
                        <Post key={post.id} setShowSignIn={props.setShowSignIn} showRecentComments={false} post={post}/>
                    )}
                </motion.section>
            }

        </>
    );
}

export default Postlist;