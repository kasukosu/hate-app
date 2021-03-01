import { useState } from 'react';
import React from 'react';
import { auth, firebase, db } from '../firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';


const Profile = () => {
    // console.log(auth.currentUser);
    // const user = auth.currentUser;
    // console.log(user.photoURL);

    return ( 
        <div className="profile-feed">
            <div className="profile-grid">
                <div className="profile-image">
                    <img src={"user.photoURL"} alt="Photo"/>
                </div>
                <div className="profile-info">
                    <ul>
                        <li>Username</li>
                        <li>nickname</li>
                        <li>Bio text</li>

                    </ul>
                </div>
                <div className="edit-profile">
                    <button>Edit profile</button>
                </div>
            </div>
            <div className="postfeed">


            </div>
        </div>
    );
}
 
export default Profile;