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

const SmallPost = React.forwardRef((props, ref) => {
    const {author, message, id, createdAt, votes, commentCount} = props.post;
    const [votesNumber, setVotesNumber] = useState(votes.length);
    const [voted, setVoted] = useState({voted:false, class:"votes no"});
    const [user] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewComment, setOpenNewComment] = useState(false);
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
        console.log("handle hate")
        if(user!=null){
            const currentUser = user.uid;
            if(!voted.voted){
                await postRef.update(
                    {
                        votes : firebase.firestore.FieldValue.arrayUnion(currentUser)
                    }
                );
                setVoted({voted: true, class:"votes yes"})
                setVotesNumber(votesNumber+1);

            }else{
                await postRef.update(
                    {
                        votes : firebase.firestore.FieldValue.arrayRemove(currentUser)
                    }
                );
                setVoted({voted: false, class:"votes no"})
                setVotesNumber(votesNumber-1);

            }
        }else{
            //show modal to login
        }
    }


    return (
        <>
        {userData && props.post ?
            <motion.div
            ref={ref}
            variants={postVariants}
            initial="hidden"
            animate="visible"
            className={`post small ${owner}`} >
            <AnimatePresence>
                {openModal &&
                    <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="modal" >
                        <Confirmation id={id} uid={author} handleDelete={confirmDeletePost} />
                    </motion.div>
                }


            </AnimatePresence>
            {userData && <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.15)'}} transition={{type:'Tween', duration:0.25}} className="post-heading">
                <div className="left">
                    <span className="copy-id">{window.location.hostname +`/post/${id}`}</span>
                    <Link className="align-center" to={`/profile/${author}`}>
                        <img src={userData.photoURL}/>
                        <span className="username">{userData.displayName}</span>
                    </Link>

                    <span className="timestamp">{getTimestamp(createdAt)}</span>
                </div>
                <div className="controls">
                    <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{type:'Tween', duration:0.25}} className="btn" onClick={()=> setOpenDropdown(!openDropdown)}>
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
                                    <DropdownSpan setOpenDropdown={setOpenDropdown} id={id} slug={"post"} text={"Share post"} className="menu-item"/>

                            </ul> :
                            <ul>
                                    <DropdownSpan setOpenDropdown={setOpenDropdown} id={id} slug={"post"} text={"Share post"} className="menu-item"/>
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
                        <div onClick={() => handleHates(id)}>
                            <span className={voted.class} >{votesNumber-1}</span>
                        </div>
                        <Link to={`/post/${id}`}>
                            <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{type:'Tween', duration:0.25}} className="comment-btn">
                                <FontAwesomeIcon icon={faCommentAlt}/>
                                <span className="count">{commentCount ? commentCount : 0 }</span>
                            </motion.div>
                        </Link>

                    </div>
                    

                    
            </div>

        </motion.div>
        : null}
        { showPostEditor && <PostEditor setShowPostEditor={setShowPostEditor} post={props.post}/>}

        </>
    );
})



export default SmallPost;

