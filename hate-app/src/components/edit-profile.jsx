import React  from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import { useState } from 'react';
import { auth, firebase, db, storage } from '../firebase/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import ImageEditor from './edit-image';

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
    const imageInputRef = React.useRef();
    const [croppedImage, setCroppedImage] = useState(null);
    const triggerImageFilePopup = () => imageInputRef.current.click();
    let newImage = imageUrl;

    const updateProfile = async(e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(user!=null){
            const {uid} = user;
            const userRef = db.collection('users').doc(uid);
            if(croppedImage === null){
                console.error(`not an image, the image file is a ${typeof(croppedImage)}`)
                setImageUrl(newUserData.photoURL);
            }
            else{
               let getPhotoUrl = new Promise((resolve, reject) => {
                    const metadata = {
                        name: "profile_pic",
                        contentType: "image/jpeg",
                    }
                    const uploadTask = storage.ref(`/photos/${uid}/${croppedImage.name}`).putString(croppedImage, "data_url", metadata);
                    uploadTask.on("state_changed", console.log, console.error, () => {
                        storage
                            .ref(`photos/${uid}/${croppedImage.name}`)
                            .getDownloadURL()
                            .then(url => {
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

            await userRef.update({
                photoURL: newImage,
                displayName: newUserData.displayName,
                bio: newUserData.bio,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            setImageUrl(newImage);
            window.location.reload();
            props.setShowEditProfile(false);

        }
    }

    const closeModal = (e) => {
        e.preventDefault();
        props.setShowEditProfile(false);
    }
    const handleImageAsFile = (e) => {
        if(e.target.files[0]){

            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.addEventListener("load", () => {
                setImage(reader.result);

            })
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
        <>
        <AnimatePresence>
            {image && <ImageEditor setPreview={setPreview} setCroppedImage={setCroppedImage} setImage={setImage} image={image}/>}
        </AnimatePresence>
            <motion.section variants={innerVariants} initial="hidden" animate="visible" exit="exit" className="modal-main">
                <motion.div whileHover={{scale: 1.1, backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{type:'tween'}} className="close-btn" onClick={()=> props.setShowEditProfile(false)}>
                    <FontAwesomeIcon icon={faTimes}/>
                </motion.div>
                <div className="modal-grid">
                    <form action="">
                    <div className="profile-image"  onClick={triggerImageFilePopup}>
                        <img src={preview} alt="Photo"/>
                        <div className="info">
                            <FontAwesomeIcon icon={faCamera}/>
                        </div>
                    </div>
                        <input name="profilePic" type="file" accept='image/*' ref={imageInputRef} onChange={handleImageAsFile}/>
                        <input value={newUserData.displayName} className="editor" name="displayName" type="text" onChange={changeHandler}/>
                        <textarea value={newUserData.bio} className="editor" name="bio" onChange={changeHandler}></textarea>
                        <input type="submit" style={{display: 'none'}}/>
                        <div className="btn-group">
                            <motion.button whileHover={{backgroundColor: 'rgb(4,174,79)'}} transition={{duration:0.15}} onClick={updateProfile} type="submit" className="save">Save</motion.button>
                        </div>
                    </form>
                </div>
            </motion.section>
        </>
     );
}

export default EditProfile;