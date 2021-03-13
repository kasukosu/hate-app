import React, {useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import {motion, AnimatePresence} from 'framer-motion';
const imageVariants = {
    hidden: {
        opacity: 0,

    },
    visible:{
        opacity: 1,

    },

}

const ProfileInfo = (props) => {
    const {data} = props;
    const {followers} = props.data.followers;
    const [isOwner, setIsOwner] = useState(false);
    const [user] = useAuthState(auth);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [followed, hasFollowed] = useState({
        followsProfile: false,
        class: "follow no",
    })
    useEffect(() =>{
        if(user!=null){
            const isOwner = data.user_id === auth.currentUser.uid ? true : false;
            setIsOwner(isOwner);
            if(data.follows.includes(user.uid)){
                hasFollowed({followsProfile: true, class:"follow yes"});
            }else{
                hasFollowed({followsProfile: false, class:"follow no"});

            }
        }
    },[]);


    const handleFollow = async(target_id) => {
        console.log(user.uid)
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

    return (

                <div className="profile-grid">
                    <div className="profile-top">
                                <motion.img variants={imageVariants} initial="hidden" animate="visible" src={data.photoURL} alt="Photo"/>
                
                        <div className="profile-top-grid">

                            {isOwner ?
                                <motion.div whileHover={{backgroundColor: 'rgba(55, 57, 70, .6)'}} onClick={()=>{props.setShowEditProfile(true)}} className="settings-btn">
                                    Modify
                                </motion.div>
                                :
                                <motion.div whileHover={{backgroundColor: 'rgba(55, 57, 70, .6)'}} onClick={() => {handleFollow(data.user_id)}} className="settings-btn">
                                    Follow
                                </motion.div>
                            }
                        </div>
                    </div>
                    <div className="profile-info">
                        <ul>
                            <li>{data.displayName}</li>

                        </ul>

                    </div>
                    <div className="bio-text">
                        <p>{data.bio}</p>
                    </div>
                </div>

     );
}

export default ProfileInfo;