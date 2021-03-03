import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';
import { useCollectionData, useDocumentDataOnce, useDocumentOnce } from 'react-firebase-hooks/firestore';
import Post from './post';
import ProfileInfo from './profileinfo';


const Profile = () => {
    const { id } = useParams();

    const postsRef = db.collection('posts');
    const userRef = db.collection('users');
    const uQuery = userRef.doc(id);
    const pQuery = postsRef.where("author", "==", id);
    const [userData, loading, error] = useDocumentDataOnce(uQuery, {idField: 'id'});
    const [posts] = useCollectionData(pQuery, {idField: 'id'});
    
    console.log(userData);
    
        
    return ( 
            
            <>{ userData &&
            <div className="profile-feed">
                {userData && 
                    <ProfileInfo data={userData}/>
                }
                
                <section className="">
                    {posts && posts.map(post => <Post key={post.id} post={post}/> )}
                </section>
                
            </div>}
            </>
    );
    
}
 
export default Profile;