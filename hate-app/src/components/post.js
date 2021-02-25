import React, { Component, useEffect, useState }  from 'react';
import { auth } from '../firebase/firebaseConfig';

const Post = (props) => {
    const {uid, message, id, photoURL, displayName, createdAt} = props.post;
    console.log(props);
    const [time, setTime] = useState();
    const owner = uid === auth.currentUser.uid ? 'owner' : 'reader';
    let today = new Date().getTime()
    console.log(today);
    console.log(createdAt);
    let diffMs = (today - createdAt);
    
    useEffect(() => {
        let tmptime = getTimestamp(diffMs);
        setTime(tmptime);
      });

    const getTimestamp = (diffMs) => {

        let diffSeconds = diffMs/1000;
        let diffMins = diffSeconds / 600000; // minutes
        let diffHrs = diffMins / 60; // hours
        console.log(diffHrs);
        let diffDays = diffHrs / 24; // days

        console.log(diffMins);
        if(diffDays >= 1){
            diffDays = Math.floor(diffDays);
            return diffDays +'d';
        }
        else if(24>diffHrs>1){
            diffHrs = Math.floor(diffHrs);
            return diffHrs +'h';
        }
        else{
            diffMins = Math.floor(diffMins);
            return diffMins + 'min';
        }
    } 

    return ( 
        
        <div className={`post ${owner}`} >
            
            <div className="post-heading">
                <img src={photoURL}/>
                <span className="username">{displayName}</span>
                <span className="timestamp">{getTimestamp(diffMs)}</span>
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