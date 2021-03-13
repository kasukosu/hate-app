import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from "react-firebase-hooks/firestore";
import {motion} from 'framer-motion';
import useFollowHook from './functions/useFollowHook';
const FollowerList = (props) => {
    console.log(props);
    console.log(props.userData.followers);    
    return ( 

        <motion.div className="follower-list">
            {props.userData.followers ? props.userData.followers.map(follower =>
                <Follower key={follower} follower={follower} />
            ) : 
            <h2>No followers 😢</h2>}
        </motion.div>

     );
}
 

const Follower = (props) => {

    console.log(props.follower)
    const userRef = db.collection('users');
    const uQuery = userRef.doc(props.follower);
    const [userData, error, loading] = useDocumentData(uQuery, {idField: 'id'});
    const [user] = useAuthState(auth);
    const [followed, hasFollowed] = useState({
        followsProfile: false,
        class: "follow no",
    })
    console.log(user);
    // const followed = useFollowHook(user.user_id)
    useEffect(() =>{
        if(userData!=null){
            if(userData.follows.includes(user.uid)){
                hasFollowed({followsProfile: true, class:"follow yes"});
            }else{
                hasFollowed({followsProfile: false, class:"follow no"});

            }
        }

    },[]);


    const handleFollow = async(target_id) => {
        console.log(user.uid)
        if(user!=null){
            if(user.uid !== target_id){

                
                const currentUser = user.uid;
                const targetRef = db.collection('users').doc(target_id);
                const currentRef = db.collection('users').doc(currentUser);
                if(!followed.followsProfile){
                    //Add id to target users followers list
                    await targetRef.update(
                        {
                            followers : firebase.firestore.FieldValue.arrayUnion(currentUser)
                        }
                    );
                    //Add id to currentusers following list
                    await currentRef.update(
                        {
                            follows : firebase.firestore.FieldValue.arrayUnion(target_id)
                        }
                    );
                    hasFollowed({followsProfile: true, class:"follow yes"});

                }else{
                    //Remove id from targetusers followers list
                    await targetRef.update(
                        {
                            followers : firebase.firestore.FieldValue.arrayRemove(currentUser)
                        }
                    );
                    //Remove id from currentusers following list
                    await currentRef.update(
                        {
                            follows : firebase.firestore.FieldValue.arrayRemove(target_id)
                        }
                    );
                    hasFollowed({followsProfile: false, class:"follow no"});

                }
            }else{
                console.log("you cant follow yourself dummy")
            }
        }
    }
    console.log(props.follower)
    return(
        <>
            {userData && 
                <div className="list-item">
                    <div className="item-container">
                        <Link to={`/profile/${userData.user_id}`}>
                            <div className="userInfo">
                                <img src={userData.photoURL} alt="Profile Pic"/>
                                <p>{userData.displayName}</p>
                            </div>                        
                        </Link>
                        <motion.div whileHover={{backgroundColor: 'rgba(55, 57, 70, .6)'}} onClick={() => {handleFollow(props.follower)}} className="settings-btn">
                            Follow
                        </motion.div>
                    </div>
                </div>
            }
        </>
    )
}

export default FollowerList;