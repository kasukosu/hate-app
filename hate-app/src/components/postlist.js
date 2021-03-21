import React, { useState, useEffect, useCallback, useRef } from 'react';
import SmallPost from './small-post';
import {db} from "../firebase/firebaseConfig";
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';
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
    const {tag} = props.currentFeed

    const postsRef = db.collection('posts');
    let [lastDoc, setLastDoc] = useState(null);
    const [pageSize, setPageSize] = useState(6);
    const [listOfPosts, setListOfPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const aQuery = postsRef.orderBy('commentCount','desc').startAfter(lastDoc).limit(pageSize);
    const nQuery = postsRef.orderBy('createdAt','desc').startAfter(lastDoc).limit(pageSize);
    
    console.log(listOfPosts.length)
    const observer = useRef()
    const lastPostRef = useCallback(node => {
        console.log(observer.current)
        if(loading){
            return
        }
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                getMorePosts();
            }
        })
        if (node) observer.current.observe(node);

    }, [loading, hasMore])

    useEffect(() => {
        getFirstPosts();
    }, [0, props.currentFeed]);

    useEffect(() => {
        setListOfPosts([]);
        setLoading(true);
    }, [tag]);

    const getFirstPosts = () => {
        console.log(tag)
        if(tag==="newest"){
            postsRef
            .orderBy('createdAt','desc')
            .limit(pageSize)
            .get()
            .then((collections) => {
                updateState(collections);
                setLoading(false);
            })
        }else if(tag==="active"){
            postsRef
            .orderBy('commentCount','desc')
            .limit(pageSize)
            .get()
            .then((collections) => {
                updateState(collections);
                setLoading(false);
            })
        }
        
    }

    const getMorePosts = () => {
        if(tag==="newest"){
            postsRef
            .orderBy('createdAt','desc')
            .startAfter(lastDoc)
            .limit(pageSize)
            .get()
            .then((collections) => {
                updateState(collections);
            })
        }else if(tag==="active"){
            postsRef
            .orderBy('commentCount','desc')
            .startAfter(lastDoc)
            .limit(pageSize)
            .get()
            .then((collections) => {
                updateState(collections);
            })
        }
    }

    const updateState = (collections) => {
        const isCollectionEmpty = collections.size === 0;
        if(!isCollectionEmpty){
            const posts = collections.docs.map((post)=> post.data());
            const lastDoc = collections.docs[collections.docs.length-1];
            setListOfPosts(listOfPosts => [...listOfPosts, ...posts]);
            console.log(lastDoc);
            setLastDoc(lastDoc);
        }else{
            setHasMore(false);
            
        }
        setLoading(false);


    }


    switch(props.currentFeed.tag) {
        case 'active':
            return(
                <div id="post-feed" className="post-feed">
                {listOfPosts && listOfPosts.map((post, index) => {
                    if(listOfPosts.length === (index+1)){
                        return <SmallPost ref={lastPostRef} key={index} post={post} setShowSignIn={props.setShowSignIn}/> 
                    }else{
                        return <SmallPost key={index} post={post} setShowSignIn={props.setShowSignIn}/> 
                    }
                })
                }
                {loading && 
                    <motion.div
                        variants={loaderAnimation}
                        animate="animationOne"
                        className="loader"
                    >
                        
                    </motion.div>
                }
                {!loading && listOfPosts.length===0 ? 
                    <div className="post">
                        <h2 className="empty">It's quite empty here 🌼</h2>
                    </div>
                : null
                
                }
            </div>

            )

        case 'newest':
            return(
                    <div className="post-feed">
                    {listOfPosts && listOfPosts.map((post, index) => {
                        if(listOfPosts.length === (index+1)){
                            return <SmallPost ref={lastPostRef} key={index} post={post} setShowSignIn={props.setShowSignIn}/> 
                        }else{
                            return <SmallPost key={index} post={post} setShowSignIn={props.setShowSignIn}/> 
                        }
                    })
                    }
                    {loading && 
                        <motion.div
                            variants={loaderAnimation}
                            animate="animationOne"
                            className="loader"
                        >
                        </motion.div>
                    }
                    {!loading && listOfPosts.length===0 ? 
                        <div className="post">
                            <h2 className="empty">It's quite empty here 🌼</h2>
                        </div>
                     : null
                    }
                </div>


            )
        default:

    }
    
}

export default FeedTabs;