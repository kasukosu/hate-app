import React, {useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, firebase } from '../firebase/firebaseConfig';

const ProfileInfo = (props) => {
    console.log(props);
    const {data} = props;
    const [isOwner, setIsOwner] = useState(false);
    const [user] = useAuthState(auth);


    useEffect(() =>{
        if(user!=null){
            const isOwner = data.user_id === auth.currentUser.uid ? true : false;
            setIsOwner(isOwner);
        }
    },[]);
   

    return ( 
                
                <div className="profile-grid">
                    <div className="profile-image">
                        <img src={data.photoURL} alt="Photo"/>
                    </div>
                    <div className="profile-info">
                        <ul>
                            <li>{data.displayName}</li>
                            <li>Name tag</li>

                        </ul>
                       {isOwner ? <div>
                            <a href="">
                                <div className="settings-btn">
                                    Modify profile
                                </div>
                            </a>
                        </div>: null} 
                    </div>
                    <div className="bio-text">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate dolorem quidem veritatis? Minima nam inventore quae tenetur! Vitae atque distinctio pariatur delectus error cum ullam quia laborum, corporis, nulla eveniet.</p>
                    </div>
                </div>

     );
}
 
export default ProfileInfo;