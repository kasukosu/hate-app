import React, { useEffect, useState }  from 'react';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import {  } from '@fortawesome/free-regular-svg-icons';

import Confirmation from './confirmation';
import CommentList from './commentlist';

const Post = (props) => {
    const {author, message, id, photoURL, displayName, createdAt, votes, comments} = props.post;
    const [show, setShow] = useState();
    const [voted, setVoted] = useState({voted:false, class:"votes no"});
    const [user] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(false);

    const showModal = () => {
        setShow({ show: true });
    };
    
    const hideModal = () => {
        setShow({ show: false });
    };

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

    const toggleControls = (e) => {
        let el = e.target.closest(".controls");
        let dropdown = el.querySelector(".control-dropdown");
        dropdown.classList.toggle("open");

    }
    const startDeletePost = (e) => {
        toggleControls(e);
        showModal({show: "show"});

    }

    const confirmDeletePost = async(choice, id, uid) => {
        const postsRef = db.collection('posts');
        console.log(id);
        if(choice===true){
            if(uid === user.uid ){
                await postsRef.doc(id).delete();
                setShow(false);

            }
            else{
                console.log("No permission to delete post");
                console.log(uid + " != " + user.uid);
                setShow(false);
            }

        }else{
            console.log(choice);
            setShow(false);
        }
    }

    const showCommentCreator = (e) => {
        let el = e.target.closest(".post-content");
        let creator = el.querySelector("#createcomment");
        creator.classList.toggle("open");

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
        
        <div className={`post ${owner}`} >
            <Confirmation show={show} id={id} uid={author} handleDelete={confirmDeletePost} />
            <div className="post-heading">
                <div className="left">
                    <img src={photoURL}/>
                    <span className="username"><a href={`/profile/${author}`}>{displayName}</a></span>
                    <span className="timestamp">{getTimestamp()}</span>
                </div>
                <div className="controls">
                    <div className="btn" onClick={toggleControls}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </div>
                    <div className="control-dropdown">
                        {isOwner ? <ul>
                            <li onClick={startDeletePost}>Remove post</li>
                            <li>Edit post</li>
                            <li>Share post</li>
                            <div onClick={toggleControls} className="layer"></div>
                        </ul> :
                        <ul>
                            <li>Share post</li>
                            <div onClick={toggleControls} className="layer"></div>
                        </ul> 
                        }
                        
                    </div>
                </div>
            </div>
            <div className="post-content">
                
                    <div className="post-message"><p>{message}</p></div>
                    <div className="action-bar">
                        <div>
                            <span className={voted.class} onClick={() => handleHates(id)}>{votes.length-1}</span>
                        </div>
                        <div className="comment-btn btn" onClick={showCommentCreator}>
                            <FontAwesomeIcon icon={faCommentAlt}/>
                        </div>
                        
                    </div>
                    <CommentList comments={comments} user={user} post_id={id} getTimestamp={getTimestamp}/>
            </div>

        </div>
    );
}
 
export default Post;