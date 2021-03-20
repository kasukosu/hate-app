import React, { useEffect, useState, useContext }  from 'react';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence }from 'framer-motion';
import {Link} from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getTimestamp } from './functions/utility';
import Confirmation from './confirmation';
import CommentList from './comment-list';
import CreateComment from './create-comment';
import PostEditor from './post-editor';
import DropdownItem from './dropdown-item';
import DropdownSpan from './dropdown-span';

import { ToastContext } from './ToastContext';

const modalVariants = {
    hidden: {
        opacity: 0,

    },
    visible:{
        opacity:1,
        y: 0,
    },
    exit:{
        opacity: 0,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
  }
const postVariants = {
    hidden:{
        y: 0,
        opacity: 0,
        scale: 0.9,
    },
    visible:{
        y: 0,
        scale: 1,
        opacity: 1,
        transition:{
            duration: 0.2
        }
    },
    exit:{
        y: 100,
        scale: 0.8,
        opacity: 0,
    }

}

const LargePost = (props) => {
    const {author, message, id, createdAt, votes, recentComments, commentCount} = props.post;
    const [voted, setVoted] = useState({voted:false, class:"votes no"});
    const [user] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewComment, setOpenNewComment] = useState(false);
    const [showRecentComments, setShowRecentComments] = useState(props.showRecentComments);
    const [showPostEditor, setShowPostEditor] = useState(false);

    const userRef = db.collection('users');
    const uQuery = userRef.doc(author);
    const [userData] = useDocumentData(uQuery, {idField: 'id'});

    const {newPostValue} = useContext(ToastContext);
    const [newPostData, setNewPostData] = newPostValue;



    let owner = 'reader';

    useEffect(() =>{
        if(user!=null){
            owner = author === auth.currentUser.uid ? 'owner' : 'reader';
            const isOwner = author === auth.currentUser.uid ? true : false;
            setIsOwner(isOwner);
            if(votes.includes(user.uid)){
                setVoted({voted: true, class:"votes yes"});
            }else{
                setVoted({voted: false, class:"votes no"});

            }
        }

    },[votes]);



    const startDeletePost = (e) => {
        setOpenModal(true);

    }

    const confirmDeletePost = async(choice, id, uid) => {
        const postsRef = db.collection('posts');
        console.log(id);
        if(choice===true){
            if(uid === user.uid ){
                await postsRef.doc(id).delete();
                setOpenModal(false);

            }
            else{
                console.log("No permission to delete post");
                console.log(uid + " != " + user.uid);
                setOpenModal(false);
            }

        }else{
            console.log(choice);
            setOpenModal(false);
        }
    }

    const handleOpenNewComment = () => {
        setOpenNewComment(!openNewComment);
        // setShowRecentComments(!showRecentComments);
    }

    const handleEditPost = () => {
        setNewPostData({

            post: props.post,

        })
    }

    const handleHates = async(id) => {
        const postRef = db.collection('posts').doc(id);
        if(user!=null){
            const currentUser = user.uid;
            if(!votes.includes(currentUser)){
                await postRef.update(
                    {
                        votes : firebase.firestore.FieldValue.arrayUnion(currentUser)
                    }
                );
            }else{
                await postRef.update(
                    {
                        votes : firebase.firestore.FieldValue.arrayRemove(currentUser)
                    }
                );
            }
        }else{
            //show modal to login
        }
    }


    return (
        <>
        {userData && props.post ?
            <motion.div
            variants={postVariants}
            initial="hidden"
            animate="visible"
            className={`post ${owner}`} >
            <AnimatePresence>
                {openModal &&
                    <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="modal" >
                        <Confirmation id={id} uid={author} handleDelete={confirmDeletePost} />
                    </motion.div>
                }


            </AnimatePresence>
            {userData && <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)'}} transition={{type:'Tween', duration:0.25}} className="post-heading">
                <div className="left">
                    <span className="copy-id">{window.location.hostname +`/post/${id}`}</span>
                    <Link className="align-center" to={`/profile/${author}`}>
                        <img src={userData.photoURL} alt="Profile pic"/>
                        <span className="username">{userData.displayName}</span>
                    </Link>

                    <span className="timestamp">{getTimestamp(createdAt)}</span>
                </div>
                <div className="controls">
                    <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)'}} transition={{type:'spring'}} className="btn" onClick={()=> setOpenDropdown(!openDropdown)}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </motion.div>
                </div>
            </motion.div> }

            <AnimatePresence>
                {openDropdown &&
                        <motion.div initial={{height: 0, opacity:0}}
                        animate={{height: 'auto', opacity: 1}}
                        transition={{duration:0.1}}
                        exit={{height: 0, opacity: 0}}
                        className="control-dropdown">
                            {isOwner ? <ul>
                                    <DropdownItem onClick={startDeletePost}>Remove post</DropdownItem>
                                    <DropdownItem onClick={handleEditPost} >Edit post</DropdownItem>
                                    <DropdownSpan setOpenDropdown={setOpenDropdown} id={id} className="menu-item">Share post</DropdownSpan>

                            </ul> :
                            <ul>
                                    <DropdownSpan setOpenDropdown={setOpenDropdown} id={id} className="menu-item">Share post</DropdownSpan>
                            </ul>
                            }

                        </motion.div>
                    }
            </AnimatePresence>

            <div className="post-content">
                    <Link to={`/post/${id}`}>
                        <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)'}} transition={{type:'Tween', duration:0.25}} className="post-message"><p>{message}</p></motion.div>
                    </Link>
                    <div className="action-bar">
                        <div>
                            <span className={voted.class} onClick={() => handleHates(id)}>{votes.length-1}</span>
                        </div>
                        {user ?
                            <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)', opacity:0.9}} transition={{type:'spring'}} className="comment-btn" onClick={()=> handleOpenNewComment()}>
                                <FontAwesomeIcon icon={faCommentAlt}/>
                                <span className="count">{commentCount ? commentCount : 0 }</span>
                            </motion.div>

                            :
                            <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)', opacity:0.9}} transition={{type:'spring'}} className="comment-btn" onClick={()=> props.setShowSignIn(true)}>
                                <FontAwesomeIcon icon={faCommentAlt}/>
                            </motion.div>
                        }
                    </div>
                    <AnimatePresence>
                        {openNewComment &&
                            <motion.div initial={{height:0}} animate={{height:'auto'}} transition={{duration: 0.1}} exit={{height: 0}}>
                                <CreateComment {...props} comments={recentComments}  user={user} post_id={id}/>
                            </motion.div>
                        }
                    </AnimatePresence>

                    { showRecentComments ?

                        <CommentList key={id} comments={recentComments}  user={user} post_id={id} /> : null
                    }
            </div>

        </motion.div>
        : null}
        { showPostEditor && <PostEditor setShowPostEditor={setShowPostEditor} post={props.post}/>}

        </>
    );
}



export default LargePost;

