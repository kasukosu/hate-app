import React from 'react';
import { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
// import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';
import { useCollectionData, useDocumentDataOnce, useDocumentOnce } from 'react-firebase-hooks/firestore';
import Post from './post';
import ProfileInfo from './profileinfo';
import EditProfile from './edit-profile';
import {motion, AnimatePresence } from 'framer-motion';
const containerVariants = {
    hidden: {
        opacity: 0,
        scale:0.9,

    },
    visible:{
        opacity:1,
        scale:1,

        transition:{
            delay: 0.2,
            duration:0.3,
        }
    },
    exit:{
        y: -50,
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

const Profile = () => {
    const { id } = useParams();
    const postsRef = db.collection('posts');
    const userRef = db.collection('users');
    const uQuery = userRef.doc(id);
    const pQuery = postsRef.where("author", "==", id);
    const [userData, loading, error] = useDocumentDataOnce(uQuery, {idField: 'id'});
    const [posts] = useCollectionData(pQuery, {idField: 'id'});
    const [showEditProfile, setShowEditProfile] = useState(false);

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
                    <ProfileInfo setShowEditProfile={setShowEditProfile} data={userData}/>
                }
                    {posts && posts.map(post => <Post key={post.id} post={post}/> )}
            </motion.div>

    );

}

export default Profile;