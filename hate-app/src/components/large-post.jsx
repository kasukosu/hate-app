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
        y: -100,
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
        if(choice===true){
            if(uid === user.uid ){
                await postsRef.doc(id).delete();
                setOpenModal(false);

            }
            else{
                console.log("No permission to delete post");
                setOpenModal(false);
            }

        }else{
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
                                    <DropdownSpan setOpenDropdown={setOpenDropdown} id={id} text={"Share post"} className="menu-item"/>

                            </ul> :
                            <ul>
                                    <DropdownSpan setOpenDropdown={setOpenDropdown} id={id} text={"Share post"} className="menu-item"/>
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
                        <div className={voted.class} onClick={() => handleHates(id)}>
                            <span >{votes.length-1}</span> 
                            <svg className={votes.class} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="skin" d="M40.5 20C40.5 31.0456 31.5456 40 20.5 40C9.45556 40 0.5 31.0456 0.5 20C0.5 8.95556 9.45556 0 20.5 0C31.5456 0 40.5 8.95556 40.5 20Z" fill="#DA2F47"/>
                                <path className="eyes" d="M28.8169 33.1989C28.7669 33 27.5191 28.3334 20.5002 28.3334C13.4802 28.3334 12.2335 33 12.1835 33.1989C12.1224 33.44 12.2313 33.69 12.4469 33.8145C12.6635 33.9356 12.9346 33.9023 13.1135 33.7289C13.1346 33.7078 15.2846 31.6667 20.5002 31.6667C25.7157 31.6667 27.8669 33.7078 27.8869 33.7278C27.9935 33.8334 28.1357 33.8889 28.278 33.8889C28.3713 33.8889 28.4657 33.8656 28.5513 33.8178C28.7691 33.6934 28.878 33.4412 28.8169 33.1989V33.1989ZM17.9524 16.9923C14.3357 13.3756 8.52353 13.3334 8.27797 13.3334C7.66464 13.3334 7.16797 13.83 7.16797 14.4423C7.16686 15.0556 7.66353 15.5534 8.27686 15.5556C8.30908 15.5556 10.4157 15.5812 12.7024 16.3745C12.0435 17.0856 11.6113 18.19 11.6113 19.4445C11.6113 21.5934 12.8546 23.3334 14.3891 23.3334C15.9235 23.3334 17.1669 21.5934 17.1669 19.4445C17.1669 19.2512 17.1457 19.0667 17.1257 18.8812C17.1402 18.8812 17.1535 18.8889 17.1669 18.8889C17.4513 18.8889 17.7357 18.78 17.9524 18.5634C18.3869 18.1289 18.3869 17.4267 17.9524 16.9923V16.9923ZM32.7224 13.3334C32.4769 13.3334 26.6657 13.3756 23.048 16.9923C22.6135 17.4267 22.6135 18.1289 23.048 18.5634C23.2646 18.78 23.5491 18.8889 23.8335 18.8889C23.848 18.8889 23.8602 18.8812 23.8735 18.8812C23.8557 19.0667 23.8335 19.2512 23.8335 19.4445C23.8335 21.5934 25.0769 23.3334 26.6113 23.3334C28.1457 23.3334 29.3891 21.5934 29.3891 19.4445C29.3891 18.19 28.9569 17.0856 28.298 16.3745C30.5846 15.5812 32.6913 15.5556 32.7246 15.5556C33.3369 15.5534 33.8335 15.0556 33.8324 14.4423C33.8313 13.83 33.3357 13.3334 32.7224 13.3334V13.3334Z" fill="#292F33"/>
                                <path className="text" d="M33.5432 36.6667H7.45656C6.07434 36.6667 4.94434 35.5367 4.94434 34.1545V27.7778C4.94434 26.3956 6.07434 25.2656 7.45656 25.2656H33.5432C34.9254 25.2656 36.0554 26.3956 36.0554 27.7778V34.1545C36.0554 35.5367 34.9254 36.6667 33.5432 36.6667Z" fill="#292F33"/>
                                <path className="text" d="M9.21269 30.2544H8.3038C7.95491 30.2544 7.79602 30 7.79602 29.7466C7.79602 29.4933 7.95491 29.24 8.3038 29.24H9.35936L9.59158 27.54C9.6438 27.16 9.80269 27.0333 10.1194 27.0333C10.3727 27.0333 10.606 27.2011 10.606 27.4555C10.606 27.6144 10.606 27.54 10.5849 27.71L10.3738 29.2411H11.3882L11.6205 27.5411C11.6727 27.1611 11.8316 27.0344 12.1482 27.0344C12.4016 27.0344 12.6349 27.2022 12.6349 27.4566C12.6349 27.6155 12.6349 27.5411 12.6138 27.7111L12.4016 29.2422H13.3105C13.6594 29.2422 13.8171 29.4966 13.8171 29.7489C13.8171 30.0022 13.6582 30.2566 13.3105 30.2566H12.2538L12.0849 31.46H12.9938C13.3427 31.46 13.5005 31.7144 13.5005 31.9677C13.5005 32.2211 13.3416 32.4744 12.9938 32.4744H11.9371L11.7049 34.1744C11.6516 34.5555 11.4927 34.6811 11.176 34.6811C10.9227 34.6811 10.6894 34.5133 10.6894 34.2589C10.6894 34.1 10.6894 34.1744 10.7105 34.0044L10.9227 32.4733H9.90936L9.67714 34.1733C9.6238 34.5544 9.46602 34.68 9.14825 34.68C8.89491 34.68 8.66158 34.5122 8.66158 34.2577C8.66158 34.0989 8.66158 34.1733 8.68269 34.0033L8.8938 32.4722H7.98714C7.63936 32.4722 7.48047 32.2177 7.48047 31.9655C7.48047 31.7111 7.63936 31.4577 7.98714 31.4577H9.0438L9.21269 30.2544V30.2544ZM10.0682 31.4577H11.0716L11.2405 30.2544H10.2371L10.0682 31.4577ZM15.1971 28.68C15.1971 27.7611 15.8838 26.9689 16.8238 26.9689C17.7638 26.9689 18.4505 27.7611 18.4505 28.68C18.4505 29.5989 17.7638 30.3811 16.8238 30.3811C15.8827 30.3822 15.1971 29.6 15.1971 28.68ZM17.3727 28.68C17.3727 28.3422 17.1716 28.0466 16.8238 28.0466C16.4749 28.0466 16.2738 28.3433 16.2738 28.68C16.2738 29.0189 16.4749 29.3044 16.8238 29.3044C17.1716 29.3044 17.3727 29.0189 17.3727 28.68ZM19.9394 27.2444C20.0771 26.9811 20.1827 26.9066 20.426 26.9066C20.7538 26.9066 21.0494 27.17 21.0494 27.4977C21.0494 27.5822 21.0494 27.6566 20.9649 27.8144L17.416 34.4577C17.2571 34.6788 17.1938 34.8055 16.9405 34.8055C16.666 34.8055 16.3382 34.5422 16.3382 34.2255C16.3382 34.0666 16.4016 33.92 16.4438 33.8344L19.9394 27.2444ZM18.9149 33.0433C18.9149 32.1244 19.6016 31.3322 20.5416 31.3322C21.4816 31.3322 22.1682 32.1244 22.1682 33.0433C22.1682 33.9611 21.4816 34.7433 20.5416 34.7433C19.6005 34.7444 18.9149 33.9611 18.9149 33.0433ZM21.0905 33.0433C21.0905 32.7044 20.8894 32.41 20.5405 32.41C20.1916 32.41 19.9905 32.7055 19.9905 33.0433C19.9905 33.3811 20.1916 33.6666 20.5405 33.6666C20.8894 33.6666 21.0905 33.3811 21.0905 33.0433ZM23.8527 33.92C23.8527 33.4655 24.2227 33.0955 24.676 33.0955C25.1305 33.0955 25.5005 33.4655 25.5005 33.92C25.5005 34.3733 25.1305 34.7433 24.676 34.7433C24.2227 34.7444 23.8527 34.3744 23.8527 33.92ZM23.916 27.6877C23.916 27.2444 24.2427 26.97 24.676 26.97C25.0994 26.97 25.4371 27.2555 25.4371 27.6877V31.7544C25.4371 32.1877 25.0994 32.4722 24.676 32.4722C24.2427 32.4722 23.916 32.1977 23.916 31.7544V27.6877ZM32.8916 34.8066C32.6838 34.8066 32.5538 34.7477 32.4127 34.5888L31.6082 33.7111L31.5282 33.7844C30.7482 34.5011 30.0749 34.8055 29.2794 34.8055C28.0471 34.8055 26.8027 34.1033 26.8027 32.5344C26.8027 31.3044 27.766 30.5689 28.3405 30.24L28.4705 30.1655L28.3649 30.0566C27.8927 29.5622 27.6994 29.1533 27.6994 28.6466C27.6994 27.45 28.7916 26.9055 29.806 26.9055C30.6549 26.9055 31.8505 27.4089 31.8505 28.5255C31.8505 29.5822 30.8694 30.1933 30.5694 30.3555L30.4416 30.4244L31.7316 31.9144L32.2249 31.3189C32.4994 30.9889 32.6594 30.85 32.9427 30.85C33.1705 30.85 33.4138 31.0544 33.4138 31.4311C33.4138 31.7133 33.1338 32.0811 32.8594 32.4033L32.5294 32.7755L33.3138 33.7066C33.4594 33.88 33.5194 33.9722 33.5194 34.1822C33.5205 34.51 33.2205 34.8066 32.8916 34.8066V34.8066ZM29.0616 30.9466C28.586 31.2655 28.1016 31.6855 28.1016 32.3811C28.1016 33.11 28.576 33.58 29.3116 33.58C29.9249 33.58 30.3216 33.3111 30.7282 32.9066L30.8071 32.83L29.1405 30.8933L29.0616 30.9466V30.9466ZM29.8071 27.9344C29.496 27.9344 29.0627 28.1889 29.0627 28.6033C29.0627 28.99 29.2527 29.2255 29.656 29.6355L29.7127 29.6933L29.7827 29.6566C30.3349 29.3677 30.6149 29.0422 30.6149 28.6911C30.616 28.1711 30.1971 27.9344 29.8071 27.9344V27.9344Z" fill="white"/>
                            </svg>
                            
                        </div>
                        {user ?
                            <motion.div whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.25)', opacity:0.9}} transition={{type:'spring'}} className="comment-btn" onClick={()=> handleOpenNewComment()}>
                                <span className="count">{commentCount ? commentCount : 0 }</span>
                                <FontAwesomeIcon icon={faCommentAlt}/>
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

        </>
    );
}



export default LargePost;

