import React  from 'react';
import {motion} from 'framer-motion';
import { useState } from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';
const EditProfile = (props) => {

    const data = props.userData;
    const [newUserData, setNewUserData] = useState(data);
    const initialData = newUserData;
    const updateProfile = async(e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(user!=null){
            const {uid, photoURL, displayName} = user;
            const userRef = db.collection('users').doc(uid);
            await userRef.update({
                photoURL: photoURL,
                displayName: newUserData.displayName,
                bio: newUserData.bio,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            props.setShowEditProfile(false);
        }
    }

    const changeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setNewUserData({
          ...newUserData,
          [e.target.name]: value
        });
    }
    return (

        <motion.div initial={{opacity: 0.2}} animate={{opacity: 1}} className="modal" onClick={()=>{props.setShowEditProfile(false)}}>
            <section className="modal-main">
                <div className="modal-grid">
                        <div className="profile-image">
                            <img src={data.photoURL} alt="Photo"/>
                        </div>
                    <form action="">
                        <input value={initialData.displayName} name="displayName" type="text" onChange={changeHandler}/>
                        <textarea value={initialData.bio} name="bio" onChange={changeHandler}></textarea>
                        <input type="submit" style={{display: 'none'}}/>
                        <div className="btn-group">
                            <motion.button whileHover={{backgroundColor: 'rgb(4,174,79)'}} transition={{duration:0.15}} onClick={updateProfile} type="submit" className="save">Save</motion.button>
                            <motion.button whileHover={{backgroundColor: 'rgb(237, 94, 104)'}} transition={{duration:0.15}} onClick={()=>{props.setShowEditProfile(false)}} className="discard" >Discard</motion.button>
                        </div>


                    </form>

                </div>
            </section>
        </motion.div>

     );
}

export default EditProfile;