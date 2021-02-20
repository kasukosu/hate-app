import { useEffect, useState } from "react";

const Post = (props) => {
    
    let post = props.post;
    return ( 
        
        <div className="post">
            <div className="profile-pic">
                <img src="" alt="pic"/>
            </div>
            <div className="post-heading">
                <h4 className="username">{post.author}</h4>
                <span className="timestamp"></span>
            </div>
            <div className="post-content">
                
                <div className="post-message"><p>{post.message}</p></div>
                <div className="action-bar">

                </div>
            </div>

        </div>
    );
}
 
export default Post;