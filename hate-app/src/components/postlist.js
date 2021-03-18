import React, { useState } from 'react';
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
            duration:0.01,

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

const FeedTabs = (props) => {

    const [currentFeed, setCurrentFeed] = useState({
        tag: 'global',
        limit: 20,
    })
    const handleTabChange = (e) => {
        console.log(e);
        setCurrentFeed({
            tag: e.target.value
        })
    }
    return ( 
        <motion.div className="feed">
            <CreatePost setShowSignIn={props.setShowSignIn}/>
            <div className="tab-selector" onChange={handleTabChange}>
                <label className="tab-container" htmlFor="">
                    <input name="currentTab" id="radio1" value="followed" type="radio" defaultChecked/>
                    <label htmlFor="radio1" className="tab-btn left">Followed</label>
                </label>
                <label className="tab-container" htmlFor="">
                    <input name="currentTab" id="radio2" value="global" type="radio" />
                    <label htmlFor="radio2" className="tab-btn right">Global</label>
                </label>
            </div>
            <AnimatePresence>
                
                    <Postlist {...props} currentFeed={currentFeed}></Postlist>
                  
            </AnimatePresence>
        </motion.div>
    );
}


const Postlist = (props, {currentFeed}) => {
    const postsRef = db.collection('posts');
    //fQuery = query, filters posts from people user follows
    const fQuery = postsRef.where("").orderBy('createdAt','desc').limit(20);
    //gQuery = query for global feed

    const gQuery = postsRef.orderBy('createdAt','desc').limit(20);

    switch(props.currentFeed.tag) {
        case 'followed':
            const [fPosts] = useCollectionData(fQuery, {idField: 'id'});

            return(
                <div className="post-feed">
                    {fPosts ? fPosts.map(post => <Post key={post.id} post={post} setShowSignIn={props.setShowSignIn}/> ):null}
                </div>

            )

        case 'global':
            const [gPosts] = useCollectionData(gQuery, {idField: 'id'});
            return(
                <div className="post-feed">
                    {gPosts ? gPosts.map(post => <Post key={post.id} post={post} setShowSignIn={props.setShowSignIn}/> ):null}
                </div>


            )

    }
    
}

export default FeedTabs;