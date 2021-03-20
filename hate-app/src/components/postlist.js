import React, { useState } from 'react';
import SmallPost from './small-post';
import {db} from "../firebase/firebaseConfig";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {motion, AnimatePresence} from 'framer-motion';
import CreatePost from "./create-post";

const loaderAnimation = {
    animationOne: {
        x: [-40, 0, 40 ],
        y: [0, 20, 0],
        transition: {
            x: {
                repeat: Infinity,
                duration: 1
            },
            y: {
                repeat: Infinity,
                duration: 0.5
            }
        },

    }
}

const FeedTabs = (props) => {
    const [currentFeed, setCurrentFeed] = useState({
        tag: 'newest',
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
                    <input name="currentTab" id="radio1" value="newest" type="radio" defaultChecked/>
                    <label htmlFor="radio1" className="tab-btn left-alt">Newest</label>
                </label>
                <label className="tab-container" htmlFor="">
                    <input name="currentTab" id="radio2" value="active" type="radio" />
                    <label htmlFor="radio2" className="tab-btn right-alt">Most Active</label>
                </label>
            </div>
            <AnimatePresence>
                <Postlist {...props} currentFeed={currentFeed}></Postlist>
            </AnimatePresence>
        </motion.div>
    );
}


const Postlist = (props) => {
    //fQuery = query, filters posts from people user follows
    //gQuery = query for global feed

    const postsRef = db.collection('posts');
    const fQuery = postsRef.orderBy('commentCount','desc').limit(20);
    const gQuery = postsRef.orderBy('createdAt','desc').limit(20);
    console.log(props.currentFeed.tag)
    switch(props.currentFeed.tag) {
        case 'active':
            const [aPosts, loadingAPosts] = useCollectionData(fQuery, {idField: 'id'});

            return(
                <div className="post-feed">
                    {aPosts && aPosts.map(post => <SmallPost key={post.id} post={post} setShowSignIn={props.setShowSignIn}/> )}
                    {loadingAPosts && 
                        <motion.div
                            variants={loaderAnimation}
                            animate="animationOne"
                            className="loader"
                        >
                            
                        </motion.div>
                    }
                    {!loadingAPosts && aPosts.length===0 ? 
                        <h2>It's quite empty here 🌼</h2> : null
                    }
                </div>

            )

        case 'newest':
            const [nPosts, loadingNPosts] = useCollectionData(gQuery, {idField: 'id'});
            return(
                <div className="post-feed">
                    {nPosts && nPosts.map(post => <SmallPost key={post.id} post={post} setShowSignIn={props.setShowSignIn}/> )}
                    {loadingNPosts && 
                        <motion.div
                            variants={loaderAnimation}
                            animate="animationOne"
                            className="loader"
                        >
                            
                        </motion.div>
                    }
                    {!loadingNPosts && nPosts.length===0 ? 
                        <h2>It's quite empty here 🌼</h2> : null
                    }
                </div>


            )
        default:

    }
    
}

export default FeedTabs;