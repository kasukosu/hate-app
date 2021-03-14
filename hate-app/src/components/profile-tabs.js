import React, {useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import {motion, AnimatePresence} from 'framer-motion';

import Post from './post';
import FollowerList from './follower-list';



const ProfileTabs = (props) => {
    console.log(props);
    const {posts, hatedPosts} = props;
    const [currentTab, setCurrentTab] = useState('posts')
    

    const handleTabChange = (e) => {
        setCurrentTab(
            e.target.value

        )
    }

    return ( 
        <>
            <div className="tab-selector" onChange={handleTabChange}>
                <label className="tab-container" htmlFor="">
                    <input name="currentTab" id="radio1" value="posts" type="radio"/>
                    <label htmlFor="radio1" className="tab-btn left">Posts</label>
                </label>
                <label className="tab-container" htmlFor="">
                    <input name="currentTab" id="radio2" value="hates" type="radio"/>
                    <label htmlFor="radio2" className="tab-btn">Hates</label>
                </label>
                <label className="tab-container " htmlFor="">
                    <input name="currentTab" id="radio3" value="followers" type="radio"/>
                    <label htmlFor="radio3" className="tab-btn right">Followers</label>
                </label>
                
            </div>
            <AnimatePresence>
               {props.posts && props.hatedPosts ? 
                    <TabItem {...props} hatedPosts={hatedPosts} posts={posts} currentTab={currentTab}></TabItem>
                 : null }   
            </AnimatePresence>
        </>
    );
}
 
const postVariants = {
    hidden:{
        x: -80,
        opacity: 0,
    },
    visible:{
        x: 0,
        opacity: 1,
        transition:{
            duration: 0.3
        }
    },
    exit:{
        x: 100,
        opacity: 0,
    }

}
const TabItem = (props) => {

    console.log(props)
    switch(props.currentTab) {
        case 'posts':
            console.log(props.posts)

            return(
                <>
                    {props.posts ? props.posts.map(post => <Post key={post.id} post={post} setShowSignIn={props.setShowSignIn}/> ):null}
                </>

            )

        case 'hates':
            console.log(props.hatedPosts)
            return(
                <>
                    {props.hatedPosts ? props.hatedPosts.map(post => <Post key={post.id} post={post} setShowSignIn={props.setShowSignIn}/> ): <h2>You dont hate on anything 🌼</h2>}
                </>


            )
        case 'followers':
            return(
                <>
                    <FollowerList {...props}></FollowerList>
                </>
            )

    }
}
export default ProfileTabs;