import React, { useState }  from 'react';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import {AnimatePresence, motion} from 'framer-motion';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getTimestamp } from './functions/utility';
import DropdownItem from './dropdown-item';
import DropdownSpan from './dropdown-span';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const containerVariants = {
    hidden: {
        opacity: 0,
        y: -30,
        scale:0.9,
    },
    visible:{
        opacity:1,
        scale:1,
        y: 0,
        transition:{
            delay: 0,
            duration:0.2,
        }
    },
    exit:{
        y: 40,
        scale: 0.8,
        opacity: 0,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
}

const CommentList = (props) => {
    const {comments, user, post_id} = props;
    const getTimestamp = props.getTimestamp;

    return (
        <>
            <AnimatePresence>
                <motion.section variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="feed">

                    {comments && comments.map(comment =>
                        <Comment key={comment.id} comment={comment} user={user} post_id={post_id} getTimestamp={getTimestamp}/>
                    )}
                </motion.section>
            </AnimatePresence>
        </>
    );
}


export default CommentList;

const Comment = (props) => {
    const {author, message, id, photoURL, displayName, votes, createdAt, post_id} = props.comment;
    console.log(votes);

    const [openDropdown, setOpenDropdown] = useState(false);

    const [user] = useAuthState(auth);
    const [voted, setVoted] = useState({voted:false, class:"votes no"});
    const userRef = db.collection('users');
    const uQuery = userRef.doc(author);
    const [userData] = useDocumentData(uQuery, {idField: 'id'});



    const handleHates = async(id) => {
        const cRef = db.collection('posts').doc(post_id).collection("comments").doc(id);
        if(user!=null){
            const currentUser = user.uid;
            if(!votes.includes(currentUser)){
                await cRef.update(
                    {
                        votes : firebase.firestore.FieldValue.arrayUnion(currentUser)
                    }
                );
            }else{
                await cRef.update(
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
            {userData &&
                <div className="comment-container">
                        <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)'}} transition={{type:'Tween', duration:0.25}} className="comment-heading">
                            <div className="left">
                                <img src={userData.photoURL} alt="Profile Pic"/>
                                <span className="username"><a href={`/profile/${author}`}>{userData.displayName}</a></span>
                                <span className="timestamp">{getTimestamp(createdAt)}</span>
                            </div>
                            {/* <div className="controls">
                                <motion.div whileHover={{backgroundColor: 'rgb(104,84,134)', opacity:0.9}} transition={{type:'spring'}} className="btn" onClick={()=> setOpenDropdown(!openDropdown)}>
                                    <FontAwesomeIcon icon={faEllipsisV}/>
                                </motion.div>
                            </div> */}
                        </motion.div>

                        {/* <AnimatePresence>

                            {openDropdown &&
                                    <motion.div
                                    initial={{height: 0, opacity:0}}
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
                        </AnimatePresence> */}


                    <div className="comment-content">
                        <div className="comment-message">
                            <p>{message}</p>
                        </div>
                        <div className="action-bar">
                            <div>
                                <span className={voted.class} onClick={() => handleHates(id)}>{votes.length-1}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
    </>
    );
}

