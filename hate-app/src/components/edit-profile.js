import React  from 'react';
import {motion} from 'framer-motion';
import { useState } from 'react';
import { auth, firebase, db, storage } from '../firebase/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const innerVariants = {
    hidden: {
        scale: 0.9,
        y: -40,
        opacity: 0,

    },
    visible:{
        scale: 1,
        opacity:1,
        y: 0,
    },
    exit:{
        opacity: 0,
        scale: 0.8,
        y: 80,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
}

const EditProfile = (props) => {

    const data = props.userData;
    const [newUserData, setNewUserData] = useState(data);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(newUserData.photoURL);
    const [preview, setPreview] = useState(newUserData.photoURL);
    let newImage = imageUrl;

    const updateProfile = async(e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(user!=null){
            const {uid} = user;
            const userRef = db.collection('users').doc(uid);
            console.log(image);
            if(image === null){
                console.error(`not an image, the image file is a ${typeof(image)}`)
                setImageUrl(newUserData.photoURL);
            }
            else{
               let getPhotoUrl = new Promise((resolve, reject) => {
                    console.log(image);
                    const uploadTask = storage.ref(`/photos/${uid}/${image.name}`).put(image);
                    uploadTask.on("state_changed", console.log, console.error, () => {
                        storage
                            .ref(`photos/${uid}/${image.name}`)
                            .getDownloadURL()
                            .then(url => {
                                console.log(url);
                                newImage = url;
                                resolve("Done");
                            })
                            .catch(error => {
                                console.log(error.code);
                                reject("Failed");

                            })
                      });
                })
                await getPhotoUrl;

            }
            console.log(imageUrl);

            await userRef.update({
                photoURL: newImage,
                displayName: newUserData.displayName,
                bio: newUserData.bio,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            setImageUrl(newImage);
            props.setShowEditProfile(false);
        }
    }

    const closeModal = (e) => {
        e.preventDefault();
        props.setShowEditProfile(false);
    }
    const handleImageAsFile = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }

    }
    const changeHandler = (e) => {

        const value = e.target.value;
        setNewUserData({
          ...newUserData,
          [e.target.name]: value
        });
    }
    return (

            <motion.section variants={innerVariants} initial="hidden" animate="visible" exit="exit" className="modal-main">
                <div className="modal-grid">
                    <div className="profile-image">
                        <img src={preview} alt="Photo"/>
                        <div className="info">
                            <FontAwesomeIcon icon={faCamera}/>
                        </div>
                    </div>
                    <form action="">
                        <input name="profilePic" type="file" onChange={handleImageAsFile}/>
                        <input value={newUserData.displayName} name="displayName" type="text" onChange={changeHandler}/>
                        <textarea value={newUserData.bio} name="bio" onChange={changeHandler}></textarea>
                        <input type="submit" style={{display: 'none'}}/>
                        <div className="btn-group">
                            <motion.button whileHover={{backgroundColor: 'rgb(4,174,79)'}} transition={{duration:0.15}} onClick={updateProfile} type="submit" className="save">Save</motion.button>
                            <motion.button whileHover={{backgroundColor: 'rgb(237, 94, 104)'}} transition={{duration:0.15}} onClick={closeModal} className="discard">Discard</motion.button>
                        </div>


                    </form>

                </div>
            </motion.section>

     );
}

export default EditProfile;