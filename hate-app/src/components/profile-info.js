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
    console.log(data)
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
        setImageLoaded(true);
    },[]);


    const handleFollow = async(e) => {
        console.log(user.uid)
        if(user!=null){
            const currentUser = user.uid;
            const targetRef = db.collection('users').doc(data.user_id);
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
                        follows : firebase.firestore.FieldValue.arrayUnion(data.user_id)
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
                        follows : firebase.firestore.FieldValue.arrayRemove(data.user_id)
                    }
                );
                hasFollowed({followsProfile: false, class:"follow no"});

            }
        }
    }

    return (

                <div className="profile-grid">
                    <div className="profile-top">
                        <AnimatePresence>
                            {imageLoaded &&
                                <motion.img variants={imageVariants} initial="hidden" animate="visible" src={data.photoURL} alt="Photo"/>
                            }

                        </AnimatePresence>
                        <div className="profile-top-grid">

                            {isOwner ?
                                <motion.div whileHover={{backgroundColor: 'rgba(55, 57, 70, .6)'}} onClick={()=>{props.setShowEditProfile(true)}} className="settings-btn">
                                    Modify
                                </motion.div>
                                :
                                <motion.div whileHover={{backgroundColor: 'rgba(55, 57, 70, .6)'}} onClick={handleFollow} className="settings-btn">
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