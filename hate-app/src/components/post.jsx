import { useEffect, useState } from "react";

const Post = (props) => {
    
    
    return ( 
        <div className="post">
            <div className="profile-pic">
                <img src="" alt="pic"/>
            </div>
            <div className="post-content">
                <div className="post-heading">
                    <h4 className="username"></h4>
                    <span className="timestamp"></span>
                </div>
                <div className="post-message"></div>
                <div className="action-bar">

                </div>
            </div>

        </div>
    );
}
 
export default Postlist;