import React, {useState, useEffect, useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { auth, firebase, db } from '../firebase/firebaseConfig';
import {motion} from 'framer-motion';
import { ToastContext } from './ToastContext';


const CreateComment = (props) => {
    const {post_id} = props;

    return (
        <>
            <CommentCreator post_id={post_id}/>
        </>
    );
}

const CommentCreator = (props) => {

    const {toastValue} = useContext(ToastContext);
    const [showToast, setShowToast] = toastValue;
    const {post_id} = props;
    const postsRef = db.collection('posts').doc(post_id).collection('comments');
    const [comment, setComment] = useState({
        message:"", author:""
    })
    const [lastMessageTime, setLastMessageTime] = useState(0);


    const addComment = async(e) => {
        e.preventDefault();
        let now = Math.floor(Date.now() / 1000)
        const user = auth.currentUser;
        if(user!=null&&comment.message.length>0){
            if(lastMessageTime+5<now){
                const {uid, photoURL, displayName} = user;
                await postsRef.add({
                    author: uid,
                    post_id: post_id,
                    photoURL: photoURL,
                    displayName: displayName,
                    message: comment.message,
                    hidden: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    votes: [{}],
            })
            setLastMessageTime(now);

            }else{
                setShowToast({
                    show:true,
                    message:"You are going too fast 😭",
                })
            }
            setComment({message:""});
        }

    }

    const changeHandler = (e) => {
        const value = e.target.value;

        setComment({
          ...comment,
          [e.target.name]: value
        });
    }

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

    return (
        <section className="create-comment">
            <motion.form  id="createcomment" onSubmit={addComment}>
                <div className="input-box">
                    <textarea placeholder="I hate this" type="text" name="message" required value={comment.message} onChange={changeHandler}/>
                    <motion.button whileHover={{backgroundColor: 'rgb(32,105,224)'  }} whileTap={{ scale: 0.9 }} onClick={addComment} type="submit" className="send">
                        Comment  <FontAwesomeIcon icon={faPaperPlane}/>
                    </motion.button>
                </div>
            </motion.form>
        </section>
    );
}

export default CreateComment;