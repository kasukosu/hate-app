import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { useDocumentData } from "react-firebase-hooks/firestore";
import {motion} from 'framer-motion';

const FollowerList = (props) => {
    console.log(props);
    
    console.log(props.userData.followers);
    return ( 

        <motion.div>
            {props.userData.followers ? props.userData.followers.map(follower =>
                <Follower key={follower} follower={follower} />
            ) : 
            <h2>No followers 😢</h2>}
        </motion.div>

     );
}
 

const Follower = (props) => {

    console.log(props)
    return(
        <div className="list-item">
            <h2>{props.follower}</h2>
        </div>
    )
}

export default FollowerList;