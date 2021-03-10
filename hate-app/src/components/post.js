import React, { useEffect, useState }  from 'react';
import { auth, db, firebase } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import {  } from '@fortawesome/free-regular-svg-icons';
import {CSSTransition} from 'react-transition-group'
import Confirmation from './confirmation';
import CommentList from './commentlist';
import { motion }from 'framer-motion';


const Post = (props) => {
    const {author, message, id, photoURL, displayName, createdAt, votes, comments} = props.post;
    const [show, setShow] = useState();
    const [voted, setVoted] = useState({voted:false, class:"votes no"});
    const [user] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewComment, setOpenNewComment] = useState(false);

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
            transition={{delay:0.5}}
        className={`post ${owner}`} >
            {openModal && <Confirmation id={id} uid={author} handleDelete={confirmDeletePost} />}
            <div className="post-heading">
                <div className="left">
                    <img src={photoURL}/>
                    <span className="username"><a href={`/profile/${author}`}>{displayName}</a></span>
                    <span className="timestamp">{getTimestamp()}</span>
                </div>
                <div className="controls">
                    <motion.div whileHover={{scale: 1.1, backgroundColor: 'darkslateblue', opacity:0.9}} transition={{type:'spring'}} className="btn" onClick={()=> setOpenDropdown(!openDropdown)}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </motion.div>
                    {openDropdown &&
                        <motion.div initial={{x: 20, opacity:0.4}} animate={{x:0, opacity: 1}} transition={{duration:0.1}} className="control-dropdown">

                            {isOwner ? <ul>
                                    <DropdownItem  delete={startDeletePost}>Remove post</DropdownItem>
                                    <DropdownItem>Edit post</DropdownItem>
                                    <DropdownItem>Share post</DropdownItem>

                                <div onClick={()=> setOpenDropdown(!openDropdown)} className="layer"></div>

                            </ul> :
                            <ul>
                                <DropdownItem>Share post</DropdownItem>
                                <div onClick={()=> setOpenDropdown(!openDropdown)} className="layer"></div>
                            </ul>
                            }

                        </motion.div>
                    }

                </div>
            </div>
            <div className="post-content">

                    <div className="post-message"><p>{message}</p></div>
                    <div className="action-bar">
                        <div>
                            <span className={voted.class} onClick={() => handleHates(id)}>{votes.length-1}</span>
                        </div>
                        <motion.div whileHover={{scale: 1.1, backgroundColor: 'darkslateblue', opacity:0.9}} transition={{type:'spring'}} className="comment-btn" onClick={()=> setOpenNewComment(!openNewComment)}>
                            <FontAwesomeIcon icon={faCommentAlt}/>
                        </motion.div>

                    </div>
                    <CommentList key={id} comments={comments} openNewComment={openNewComment} user={user} post_id={id} getTimestamp={getTimestamp}/>
            </div>

        </motion.div>
    );
}

const DropdownItem = (props) => {
    return (
        <a onClick={props.delete} href="#" className="menu-item">
            <span className="icon-button">{props.leftIcon}</span>
            {props.children}
            <span className="icon-right">{props.rightIcon}</span>

        </a>

    );
}


export default Post;

