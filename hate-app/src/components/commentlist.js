import React, { useEffect, useState }  from 'react';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import {motion} from 'framer-motion';

const CommentList = (props) => {
    const {comments, user, post_id} = props;
    const getTimestamp = props.getTimestamp;
    console.log("went here");

    return (
        <>
            {comments && comments.map(comment =>
                <Comment key={comment.id} comment={comment} user={user} post_id={post_id} getTimestamp={getTimestamp}/>
            )}
        </>
    );
}


export default CommentList;

const Comment = (props) => {
    const {author, message, id, photoURL, displayName, votes, createdAt, post_id} = props.comment;
    console.log(votes);
    const [user] = useAuthState(auth);
    const getTimestamp = props.getTimestamp;
    const [voted, setVoted] = useState({voted:false, class:"votes no"});
    const [isOwner, setIsOwner] = useState(false);

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

            <div className="comment-container">
                <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)'}} transition={{type:'Tween', duration:0.25}} className="comment-heading">
                    <div className="left">
                        <img src={photoURL}/>
                        <span className="username"><a href={`/profile/${author}`}>{displayName}</a></span>
                        {/* <span className="timestamp">{getTimestamp()}</span> */}
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
            </div>

    </>
    );
}

