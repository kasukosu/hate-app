import React, { useEffect } from 'react';
import { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { useParams } from 'react-router-dom';
import { useCollectionData, useDocumentData, useDocumentOnce } from 'react-firebase-hooks/firestore';

import ProfileInfo from './profile-info';
import ProfileTabs from './profile-tabs';
import EditProfile from './edit-profile';
import {motion, AnimatePresence } from 'framer-motion';
const containerVariants = {
    hidden: {
        opacity: 0,
        scale:0.9,
        y: -50,

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

const modalVariants = {
    hidden: {
        opacity: 0,

    },
    visible:{
        opacity:1,
        y: 0,
    },
    exit:{
        opacity: 0,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
}

const Profile = (props) => {
    const { id } = useParams();
    const userRef = db.collection('users');
    const uQuery = userRef.doc(id);
    const [userData] = useDocumentData(uQuery, {idField: 'id'});
    const [showEditProfile, setShowEditProfile] = useState(false);
    const postsRef = db.collection('posts');
    const pQuery = postsRef.where("author", "==", id);
    const [posts] = useCollectionData(pQuery, {idField: 'id'});
    const hQuery = postsRef.where("votes", "array-contains", id);
    const [hatedPosts] = useCollectionData(hQuery, {idField: 'id'});
    const [postCount, setPostCount] = useState();

    useEffect(() =>{
        console.log(posts)
        if(posts){
            let count = posts.length;
            setPostCount(count)
        }
        
    },[posts]);


    return (

            <motion.div variants={containerVariants} initial="hidden" animate="visible"  exit="exit" className="feed">
                <AnimatePresence>
                {showEditProfile &&
                    <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="modal" >
                        <EditProfile setShowEditProfile={setShowEditProfile} userData={userData} />
                    </motion.div>
                    }
                </AnimatePresence>
                {userData &&
                    <ProfileInfo postCount={postCount} setShowEditProfile={setShowEditProfile} data={userData}/>
                }
                {posts && hatedPosts && userData ? <ProfileTabs posts={posts} setShowSignIn={props.setShowSignIn} hatedPosts={hatedPosts} userData={userData}></ProfileTabs> : null}
            </motion.div>

    );

}

export default Profile;