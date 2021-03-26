import React, { useState, useEffect }  from 'react';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import {AnimatePresence, motion} from 'framer-motion';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getTimestamp } from './functions/utility';
import {Link} from 'react-router-dom';


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
                <motion.section variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="post-feed">
                    {comments && comments.map(comment =>
                        <Comment key={comment.id} comment={comment} user={user} post_id={post_id} getTimestamp={getTimestamp}/>
                    )}
                </motion.section>
            </AnimatePresence>
        </>
    );
}


export default CommentList;


const itemVariants = {
    hidden:{
        y: -40,
        opacity: 0,
    },
    visible:{
        y: 0,
        opacity: 1,
        transition:{
            delay: 0.1,
            duration: 0.2
        }
    },
    exit:{
        y: 40,
        opacity:0,
    }

}

const Comment = (props) => {
    const {author, message, id, votes, createdAt, post_id} = props.comment;
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

    useEffect(() =>{
        if(user!=null){
            if(votes.includes(user.uid)){
                setVoted({voted: true, class:"votes yes"});
            }else{
                setVoted({voted: false, class:"votes no"});
            }
        }

    },[votes]);

    return (
        <>            
        <AnimatePresence>
            {userData &&
                <motion.div variants={itemVariants} initial="hidden" animate="visible" exit="exit" className="comment-container">
                    <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)'}} transition={{type:'Tween', duration:0.25}} className="comment-heading">
                        <div className="left">
                            <Link className="align-center" to={`/profile/${author}`}>
                                <img src={userData.photoURL} alt="Profile pic"/>
                                <span className="username">{userData.displayName}</span>
                            </Link>

                            <span className="timestamp">{getTimestamp(createdAt)}</span>
                        </div>
                    </motion.div>

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
                </motion.div>
            }
        </AnimatePresence>
    </>
    );
}

