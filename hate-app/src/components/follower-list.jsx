import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from "react-firebase-hooks/firestore";
import {motion, AnimatePresence} from 'framer-motion';


const itemVariants = {
    hidden:{
        x: -40,
        opacity: 0,
    },
    visible:{
        x: 0,
        opacity: 1,
        transition:{
            delay: 0.1,
            duration: 0.2
        }
    },
    exit:{
        x: -40,
        opacity:0,
    }

}
const FollowerList = (props) => {
    console.log(props.userData.followers);    
    return ( 

        <motion.div className="follower-list">
            {props.userData.followers && props.userData.followers.length>0 ? props.userData.followers.map(follower =>
                <Follower key={follower} follower={follower} />
            ) : 
            <h2>No followers 😢</h2>}
        </motion.div>

     );
}
 
const followVariants = {
    hidden:{
    },
    visible:{
        backgroundColor: 'rgb(55, 57, 70)',
        x: 0,
    },
    exit:{
        backgroundColor: 'rgb(4,134,79)',

    }
}
const unfollowVariants = {
    hidden:{
        backgroundColor: 'rgb(4,134,79)',
    },
    visible:{
        backgroundColor: 'rgb(4,144,79)',
    },
    exit:{
        backgroundColor: 'rgb(55, 57, 70)',
    }
}

const Follower = (props) => {

    const followerId = props.follower;
    console.log(props);
    console.log(followerId);
    const userRef = db.collection('users');
    const uQuery = userRef.doc(followerId);
    const [isOwner, setIsOwner] = useState(false);
    const [userData] = useDocumentData(uQuery, {idField: 'id'});
    const [user] = useAuthState(auth);
    const [followed, hasFollowed] = useState({
        followsProfile: false,
        class: "follow no",
    })
    // const followed = useFollowHook(user.user_id)
    useEffect(() =>{
        if(userData!=null){
            if(userData.follows.includes(user.uid)){
                hasFollowed({followsProfile: true, class:"follow_btn follow yes"});
            }else{
                hasFollowed({followsProfile: false, class:"follow_btn follow no"});

            }
        }
    },[userData]);


    const handleFollow = async(target_id) => {
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
                    hasFollowed({followsProfile: true, class:"follow_btn yes"});

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
                    hasFollowed({followsProfile: false, class:"follow_btn no"});

                }
            }else{
                console.log("you cant follow yourself dummy")
            }
        }
    }
    return(
        <>
            <AnimatePresence>
                {userData && 
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" exit="exit" className="list-item" whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.5)'}} transition={{type:'Tween', duration:0.25}}>
                        <div className="item-container">
                            <Link to={`/profile/${userData.user_id}`}>
                                <div className="userInfo">
                                    <img src={userData.photoURL} alt="Profile Pic"/>
                                    <p>{userData.displayName}</p>
                                </div>                        
                            </Link>
                            
                            {user ? 
                                <div className="follow-container">
                                    <AnimatePresence>
                                    { followed.followsProfile ? 
                                        <motion.div whileHover={{opacity: 0.8}} onClick={() => {handleFollow(userData.user_id)}} 
                                            variants={unfollowVariants}
                                            initial="hidden" 
                                            animate="visible" 
                                            exit="exit" 
                                            className={followed.class}>Followed
                                        </motion.div> 
                                    :
                                        <motion.div whileHover={{opacity: 0.8}} onClick={() => {handleFollow(userData.user_id)}}
                                            variants={followVariants}
                                            initial="hidden" 
                                            animate="visible" 
                                            exit="exit" 
                                            className={followed.class}>Follow
                                        </motion.div> 
                                    }
                                    </AnimatePresence>
                                </div>
                                
                                : null }   
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}

export default FollowerList;