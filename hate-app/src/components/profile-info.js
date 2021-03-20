import React, {useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {motion, AnimatePresence} from 'framer-motion';
import DropdownItem from './dropdown-item';
import DropdownSpan from './dropdown-span';

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

const ProfileInfo = (props) => {
    const {data} = props;
    const [isOwner, setIsOwner] = useState(false);
    const [user] = useAuthState(auth);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [followed, hasFollowed] = useState({
        followsProfile: false,
        class: "follow no",
    })
    useEffect(() =>{
        if(user!=null){
            const isOwner = data.user_id === auth.currentUser.uid ? true : false;
            setIsOwner(isOwner);
            if(data.followers.includes(user.uid)){
                hasFollowed({followsProfile: true, class:"follow yes"});
            }else{
                hasFollowed({followsProfile: false, class:"follow no"});

            }
        }
    },[]);
    const handleFollow = async(target_id) => {
        if(user!=null){
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
        }
    }

    const handleLogOut = () => {
        auth.signOut();
        document.location.href="/";
  
    }

    return (

                <div className="profile-grid">
                    <div className="profile-heading">
                        
                        <p className="heading-username">{data.displayName}</p>
                        <motion.div whileHover={{ backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{type:'tween'}} className="btn" onClick={()=> setOpenDropdown(!openDropdown)}>
                            <FontAwesomeIcon icon={faEllipsisH}/>
                        </motion.div>

                    </div>
                    <AnimatePresence>

                        {openDropdown &&
                            <motion.div initial={{height: 0, opacity:0}} animate={{height: 'auto', opacity: 1}} transition={{duration:0.1}} exit={{height: 0, opacity: 0}} className="control-dropdown">
                                {isOwner ? <ul>
                                        <DropdownItem onClick={handleLogOut}>Log out</DropdownItem>
                                        <DropdownSpan setOpenDropdown={setOpenDropdown} id={data.user_id} slug={"profile"} text={"Share profile"} className="menu-item"/>
                                </ul> :
                                <ul>
                                    <DropdownSpan setOpenDropdown={setOpenDropdown} id={data.user_id} slug={"profile"} text={"Share profile"} className="menu-item"/>
                                </ul>
                                }
                            </motion.div>
                        }
                    </AnimatePresence>

                    <div className="profile-top">
                            <motion.img src={data.photoURL} alt="Photo"/>
                        <div className="profile-top-grid">
                            
                            <div className="profile-stats">
                                <p><span className="count">{props.postCount}</span> Posts</p>
                                <p><span className="count">{data.followers.length}</span> Followers</p>
                                <p><span className="count">{data.follows.length}</span> Following</p>

                            </div>
                            <div className="follow-container">
                                {isOwner ?
                                    <motion.div whileHover={{backgroundColor: 'rgba(55, 57, 70, .6)'}} onClick={()=>{props.setShowEditProfile(true)}} className="settings-btn">
                                        Modify
                                    </motion.div>
                                : null }
                            </div>

                            {user && !isOwner ? 
                                <div className="follow-container">
                                    <AnimatePresence>
                                    { followed.followsProfile ? 
                                        <motion.div whileHover={{opacity: 0.8}} onClick={() => {handleFollow(data.user_id)}} 
                                        variants={unfollowVariants}
                                        initial="hidden" 
                                        animate="visible" 
                                        exit="exit" 
                                        className={followed.class}>Followed</motion.div> 
                                    :
                                        <motion.div whileHover={{opacity: 0.8}} onClick={() => {handleFollow(data.user_id)}}
                                        variants={followVariants}
                                        initial="hidden" 
                                        animate="visible" 
                                        exit="exit" 
                                        className={followed.class}>Follow</motion.div> 
                                    }
                                    </AnimatePresence>
                                </div>
                                
                                : null }    
                            
                        </div>
                    </div>
                    
                    <div className="bio-text">
                        <p>{data.bio}</p>
                    </div>
                </div>

     );
}

export default ProfileInfo;