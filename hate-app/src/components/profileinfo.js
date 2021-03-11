import React, {useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import {motion} from 'framer-motion';
const ProfileInfo = (props) => {
    console.log(props);
    const {data} = props;
    const [isOwner, setIsOwner] = useState(false);
    const [user] = useAuthState(auth);


    useEffect(() =>{
        if(user!=null){
            const isOwner = data.user_id === auth.currentUser.uid ? true : false;
            setIsOwner(isOwner);
        }
    },[]);


    return (

                <div className="profile-grid">
                    <div className="profile-image">
                        <img src={data.photoURL} alt="Photo"/>
                    </div>
                    <div className="profile-info">
                        <ul>
                            <li>{data.displayName}</li>

                        </ul>
                       {isOwner ? <div>
                            <motion.div whileHover={{backgroundColor: 'rgba(55, 57, 70, .6)'}} onClick={()=>{props.setShowEditProfile(true)}} className="settings-btn">
                                Modify
                            </motion.div>
                        </div>: null}
                    </div>
                    <div className="bio-text">
                        <p>{data.bio}</p>
                    </div>
                </div>

     );
}

export default ProfileInfo;