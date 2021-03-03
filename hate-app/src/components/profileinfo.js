import React from 'react';

const ProfileInfo = (props) => {
    const {data} = props;

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
                    </div>
                    <div className="bio-text">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate dolorem quidem veritatis? Minima nam inventore quae tenetur! Vitae atque distinctio pariatur delectus error cum ullam quia laborum, corporis, nulla eveniet.</p>
                    </div>
                </div>

     );
}
 
export default ProfileInfo;