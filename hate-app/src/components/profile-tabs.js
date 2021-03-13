import React, {useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import {motion, AnimatePresence} from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useCollectionData, useDocumentDataOnce, useDocumentOnce } from 'react-firebase-hooks/firestore';

import Post from './post';
import FollowerList from './follower-list';

const ProfileTabs = (props) => {
    const { id } = useParams();
    const postsRef = db.collection('posts');
    const pQuery = postsRef.where("author", "==", id);
    const hQuery = postsRef.where("votes", "array-contains", id);

    const [currentTab, setCurrentTab] = useState('posts')
    const [posts] = useCollectionData(pQuery, {idField: 'id'});
    const [hatedPosts] = useCollectionData(hQuery, {idField: 'id'});

    const handleTabChange = (e) => {
        setCurrentTab(
            e.target.value

        )
        

        console.log(currentTab);
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
                <TabItem {...props} hatedPosts={hatedPosts} posts={posts} currentTab={currentTab}/>
            
        </>
    );
}
 
const TabItem = (props) => {

    
    switch(props.currentTab) {
        case 'posts':
            console.log(props.posts)

            return(
                <div className="feed">
                    <h1>My posts</h1>
                    {props.posts ? props.posts.map(post => <Post key={post.id} post={post}/> ):null}
                </div>

            )

        case 'hates':
            console.log(props.hatedPosts)
            return(
                <>
                    <div className="feed">
                        <h1>Hated posts</h1>
                        {props.hatedPosts ? props.hatedPosts.map(post => <Post key={post.id} post={post}/> ): <h2>You dont hate on anything 🌼</h2>}
                    </div>

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