import React from 'react';
import LargePost from './large-post';
import {db} from "../firebase/firebaseConfig";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import CommentList from './comment-list';
import { useParams } from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';



const FullPost = (props) => {

    const { id } = useParams()
    const pRef = db.collection("posts").doc(id);
    const pQuery = pRef;
    const cRef = db.collection("posts").doc(id).collection("comments");
    const cQuery = cRef.orderBy("createdAt", "desc").limit(150);

    const [postData ] = useDocumentData(pQuery, {idField: 'id'});
    const [comments] = useCollectionData(cQuery, {idField: 'id'});

    const containerVariants = {
        hidden:{
            y: -50,
            opacity: 0,
        },
        visible:{
            y: 0,
            opacity: 1,
            transition:{
                delay: 0.2,
                duration: 0.2,
            }
        },
        exit:{
            y: 50,
            opacity: 0,
            transition: {
                ease: 'easeInOut',
            }
        },



    }

    return (
        <>
            {postData &&
                <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="feed">
                    <AnimatePresence>
                        {postData &&
                            <LargePost setShowSignIn={props.setShowSignIn} showRecentComments={false} post={postData}/>
                        }
                    </AnimatePresence>
                    {comments &&
                        <CommentList comments={comments}/>
                    }

                </motion.section>
            }
        </>
    );
}

export default FullPost;