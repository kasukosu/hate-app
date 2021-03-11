import React, { useEffect, useState }  from 'react';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faEllipsisV, faUnderline } from '@fortawesome/free-solid-svg-icons';
import {  } from '@fortawesome/free-regular-svg-icons';
import Confirmation from './confirmation';
import CommentList from './commentlist';
import CreateComment from './create-comment';

import { motion, AnimatePresence }from 'framer-motion';
import {Link} from 'react-router-dom';

const Post = (props) => {
    const {author, message, id, photoURL, displayName, createdAt, votes, recentComments} = props.post;
    const [show, setShow] = useState();
    const [voted, setVoted] = useState({voted:false, class:"votes no"});
    const [user] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewComment, setOpenNewComment] = useState(false);
    const [showRecentComments, setShowRecentComments] = useState(props.showRecentComments);
    const [showComments, setShowComments] = useState(true);



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

    const getTimestamp = () => {
        if(createdAt!=null){
            let today = new Date().getTime()
            let diffSeconds = (today/1000 - createdAt.seconds);
            let diffMins = diffSeconds / 60; // minutes
            let diffHrs = diffMins / 60; // hours
            let diffDays = diffHrs / 24; // days

            if(diffHrs >= 24){
                diffDays = Math.floor(diffDays);
                return diffDays +'d';
            }
            else if(24>diffHrs && diffHrs>1){
                diffHrs = Math.floor(diffHrs);
                return diffHrs +'h';
            }
            else if(diffMins>=1 && diffHrs<1){
                diffMins = Math.floor(diffMins);
                return diffMins +'min';
            }
            else{
                diffSeconds = Math.floor(diffSeconds);
                return diffSeconds + 's';
            }
        }else{
            return "refresh";
        }

    }

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

        <motion.div
            initial={{
                y:-100,
                opacity: 0.01
            }}
            animate={{
                y:0,
                opacity: 1
            }}
        className={`post ${owner}`} >
            {openModal && <Confirmation id={id} uid={author} handleDelete={confirmDeletePost} />}
            <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)'}} transition={{type:'Tween', duration:0.25}} className="post-heading">
                <div className="left">

                    <Link className="align-center" to={`/profile/${author}`}>
                        <img src={photoURL}/>
                        <span className="username">{displayName}</span>
                    </Link>

                    <span className="timestamp">{getTimestamp()}</span>
                </div>
                <div className="controls">
                    <motion.div whileHover={{scale: 1.1, backgroundColor: 'rgb(104,84,134)', opacity:0.9}} transition={{type:'spring'}} className="btn" onClick={()=> setOpenDropdown(!openDropdown)}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </motion.div>
                </div>
            </motion.div>
            <AnimatePresence>

                {openDropdown &&
                        <motion.div initial={{height: 0, opacity:0}} animate={{height: 'auto', opacity: 1}} transition={{duration:0.1}} exit={{height: 0, opacity: 0}} className="control-dropdown">

                            {isOwner ? <ul>
                                    <DropdownItem  delete={startDeletePost}>Remove post</DropdownItem>
                                    <DropdownItem>Edit post</DropdownItem>
                                    <DropdownItem>Share post</DropdownItem>

                            </ul> :
                            <ul>
                                <DropdownItem>Share post</DropdownItem>
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
                            <motion.div whileHover={{scale: 1.1, backgroundColor: 'rgb(104,84,134)', opacity:0.9}} transition={{type:'spring'}} className="comment-btn" onClick={()=> setOpenNewComment(!openNewComment)}>
                                <FontAwesomeIcon icon={faCommentAlt}/>
                            </motion.div>
                            :
                            <motion.div whileHover={{scale: 1.1, backgroundColor: 'rgb(104,84,134)', opacity:0.9}} transition={{type:'spring'}} className="comment-btn" onClick={()=> props.setShowSignIn(true)}>
                                <FontAwesomeIcon icon={faCommentAlt}/>
                            </motion.div>
                        }
                    </div>
                    <AnimatePresence>
                        {openNewComment &&
                            <motion.div initial={{height:0}} animate={{height:240}} transition={{duration: 0.1}} exit={{height: 0}}>
                                <CreateComment {...props} comments={recentComments}  user={user} post_id={id}/>
                            </motion.div>
                        }
                    </AnimatePresence>

                    { showRecentComments ?
                        <CommentList key={id} comments={recentComments}  user={user} post_id={id} getTimestamp={getTimestamp}/> : null
                    }
            </div>

        </motion.div>
    );
}

const DropdownItem = (props) => {
    return (
        <motion.a whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{duration:0.1}} onClick={props.delete} href="#" className="menu-item">
            <span className="icon-button">{props.leftIcon}</span>
            {props.children}
            <span className="icon-right">{props.rightIcon}</span>

        </motion.a>

    );
}


export default Post;

