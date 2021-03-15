import React  from 'react';
import {motion} from 'framer-motion';
import { useState } from 'react';
import { auth, firebase, db, storage } from '../firebase/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';
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
            console.log(croppedImage);
            if(croppedImage === null){
                console.error(`not an image, the image file is a ${typeof(croppedImage)}`)
                setImageUrl(newUserData.photoURL);
            }
            else{
               let getPhotoUrl = new Promise((resolve, reject) => {
                    console.log(croppedImage);
                    const uploadTask = storage.ref(`/photos/${uid}/${croppedImage.name}`).putString(croppedImage, "data_url");
                    uploadTask.on("state_changed", console.log, console.error, () => {
                        storage
                            .ref(`photos/${uid}/${croppedImage.name}`)
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
        {image && <ImageEditor setPreview={setPreview} setCroppedImage={setCroppedImage} setImage={setImage} image={image}/>}

            <motion.section variants={innerVariants} initial="hidden" animate="visible" exit="exit" className="modal-main">
                <div className="modal-grid">
                    <div className="profile-image"  onClick={triggerImageFilePopup}>
                        <img src={preview} alt="Photo"/>
                        <div className="info">
                            <FontAwesomeIcon icon={faCamera}/>
                        </div>
                    </div>
                    <form action="">
                        <input name="profilePic" type="file" accept='image/*' ref={imageInputRef} onChange={handleImageAsFile}/>
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
        </>
     );
}

export default EditProfile;