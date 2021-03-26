import React, { useState, useContext, useEffect  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { auth, firebase, db } from '../firebase/firebaseConfig';
import { ToastContext } from './ToastContext';
import {motion} from 'framer-motion';
const CreatePost = (props) => {
    const postsRef = db.collection('posts');
    const [blogpost, setBlogPost] = useState({
        message:"", author:""
    })
    const [lastMessageTime, setLastMessageTime] = useState(0);
    const user = auth.currentUser;

    const {toastValue} = useContext(ToastContext);
    const [showToast, setShowToast] = toastValue;

    useEffect(()=> {
        setTimeout(()=>{
            if(showToast.show){
                setShowToast({
                    show:false,
                    message:"",
                })
            }
        }, 2500)
    },[showToast])


    const addPost = async(e) => {
        e.preventDefault();
        let now = Math.floor(Date.now() / 1000)

        if(user!=null && blogpost.message.length>0){
            const {uid, photoURL, displayName} = user;

            if(lastMessageTime+5<now){
                await postsRef.add({
                    author: uid,
                    photoURL: photoURL,
                    displayName: displayName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    message: blogpost.message,
                    hidden: false,
                    votes: [{}],
                    commentCount: 0,
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
                })
                setLastMessageTime(now);
            }
            else{
                setShowToast({
                    show:true,
                    message:"You are going too fast 😭",
                })
            }
            setBlogPost({message:""});
        }

    }

    const changeHandler = (e) => {
        const value = e.target.value;

        setBlogPost({
          ...blogpost,
          [e.target.name]: value
        });
    }

    return (
        <section className="create-post">
            {user ? null : 
                    <div onClick={()=>{props.setShowSignIn(true)}} className="loginFirst">
                        <p>😈 Login to start hating! 😈</p>
                    </div>
                }
            <form className="creator" onSubmit={addPost}>
                
                <div className="input-box">
                    <textarea placeholder="What did you hate today?" type="text" name="message" required value={blogpost.message} onChange={changeHandler}/>
                    <motion.button whileHover={{backgroundColor: 'rgb(4,144,79)'}}  whileTap={{scale: 0.9 }} transition={{duration:0.15}} type="submit" className="send" onClick={addPost}>
                        Post  <FontAwesomeIcon icon={faPaperPlane}/>
                    </motion.button>
                </div>

            </form>
        </section>
    );

}

export default CreatePost;