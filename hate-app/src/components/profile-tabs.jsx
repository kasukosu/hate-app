import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {db} from "../firebase/firebaseConfig";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SmallPost from './small-post';
import FollowerList from './follower-list';


const ProfileTabs = (props) => {
    const [currentTab, setCurrentTab] = useState('posts')

    const handleTabChange = (e) => {
        setCurrentTab(
            e.target.value

        )
    }

    return ( 
        <>
            <div className="tab-selector" onChange={handleTabChange}>
                <label className="tab-container" htmlFor="">
                    <input name="currentTab" id="radio1" value="posts" defaultChecked type="radio"/>
                    <label htmlFor="radio1" className="tab-btn left">Posts</label>
                </label>
                <label className="tab-container" htmlFor="">
                    <input name="currentTab" id="radio2" value="hates" type="radio"/>
                    <label htmlFor="radio2" className="tab-btn">Hates</label>
                </label>
                <label className="tab-container " htmlFor="">
                    <input name="currentTab" id="radio3" value="followers" type="radio"/>
                    <label htmlFor="radio3" className="tab-btn right">Followers</label>
                </label>
                
            </div>
            <AnimatePresence>
               {props.userData ? 
                    <TabItem {...props} currentTab={currentTab}></TabItem>
                 : null }   
            </AnimatePresence>
        </>
    );
}

const loaderAnimation = {
    animationOne: {
        x: [-40, 0, 40 ],
        y: [0, 20, 0],
        transition: {
            x: {
                repeat: Infinity,
                duration: 1
            },
            y: {
                repeat: Infinity,
                duration: 0.5
            }
        },

    }
}
const TabItem = (props) => {
    const postsRef = db.collection('posts');

    switch(props.currentTab) {
        case 'posts':
            const pQuery = postsRef.where("author", "==", props.userData.id);
            const [posts, loadingPosts] = useCollectionData(pQuery, {idField: 'id'});
            return(
                <>
                    {posts && posts.map(post => <SmallPost key={post.id} post={post} setShowSignIn={props.setShowSignIn}/> )}
                    {loadingPosts && 
                        <motion.div
                            variants={loaderAnimation}
                            animate="animationOne"
                            className="loader"
                        >
                            
                        </motion.div>
                    }
                    {!loadingPosts && posts.length===0 ? 
                        <h2>It's quite empty here 🌼</h2> : null
                    }
                </>

            )

        case 'hates':
            const hQuery = postsRef.where("votes", "array-contains", props.userData.id);
            const [hatedPosts, loadingHPosts] = useCollectionData(hQuery, {idField: 'id'});
            return(
                <>
                    {hatedPosts && hatedPosts.map(post => <SmallPost key={post.id} post={post} setShowSignIn={props.setShowSignIn}/>)}
                    {loadingHPosts && 
                        <motion.div
                            variants={loaderAnimation}
                            animate="animationOne"
                            className="loader"
                        >
                        </motion.div>
                    }
                    {!loadingHPosts && hatedPosts.length===0 ? 
                        <h2>It's quite empty here 🌼</h2> : null
                    }
                </>
            )

        case 'followers':
            return(
                <>
                    <FollowerList {...props}></FollowerList>
                </>
            )

    }
}
export default ProfileTabs;