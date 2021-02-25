import React, { useEffect, useState }  from 'react';
import { auth } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const Post = (props) => {
    const {uid, message, id, photoURL, displayName, createdAt} = props.post;
    const [time, setTime] = useState();
    const [user] = useAuthState(auth);
    console.log(user);
    let owner = 'reader';
    if(user!=null){
        owner = uid === auth.currentUser.uid ? 'owner' : 'reader';

    }

    let today = new Date().getTime()
    let diffSeconds = (today/1000 - createdAt.seconds);

    useEffect(() => {
        let tmptime = getTimestamp(diffSeconds);
        setTime(tmptime);
      });

    const getTimestamp = (diffSeconds) => {

        let diffMins = diffSeconds / 60; // minutes
        let diffHrs = diffMins / 60; // hours
        let diffDays = diffHrs / 24; // days

        console.log(diffHrs);
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
    } 

    const toggleControls = (e) => {
        let el = e.target.closest(".controls");
        let dropdown = el.querySelector(".control-dropdown");
        console.log(dropdown);

        dropdown.classList.toggle("open");

    }
    const deletePost = (e) => {
        let el = e.target.closest(".controls");
        let dropdown = el.querySelector(".control-dropdown");
        console.log(dropdown);

        dropdown.classList.toggle("open");

    }



    return ( 
        
        <div className={`post ${owner}`} >
            
            <div className="post-heading">
                <div className="left">
                    <img src={photoURL}/>
                    <span className="username">{displayName}</span>
                    <span className="timestamp">{getTimestamp(diffSeconds)}</span>
                </div>
                
                <div className="controls">
                    <div className="btn" onClick={toggleControls}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </div>
                    <div className="control-dropdown">
                        <ul>
                            <li  onClick={deletePost}>Remove post</li>
                            <li>Edit post</li>
                            <li>Share post</li>
                            <div onClick={toggleControls} className="layer"></div>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="post-content">
                
                <div className="post-message"><p>{message}</p></div>
                <div className="action-bar">

                </div>
            </div>

        </div>
    );
}
 
export default Post;