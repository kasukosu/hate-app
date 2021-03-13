// import { auth, db, firebase } from '../../firebase/firebaseConfig';
// import { useDocumentData } from 'react-firebase-hooks/firestore';
// import {useState} from 'react';

// const useFollowHook = async(target_id) => {

//     const [followed, hasFollowed] = useState({
//         followsProfile: false,
//         class: "follow no",
//     })

//     let user = auth.currentUser;
    
//     if(user!=null){
//         const userRef = db.collection('users');
//         const tQuery = userRef.doc(target_id);
//         const [targetData] = useDocumentData(tQuery, {idField: 'id'});
//         const currentUser = user.uid;
//         const targetRef = db.collection('users').doc(target_id);
//         const currentRef = db.collection('users').doc(currentUser);
        
//         if (!targetData.followers.includes(currentUser)){
//             //Add id to target users followers list
//             await targetRef.update(
//                 {
//                     followers : firebase.firestore.FieldValue.arrayUnion(currentUser)
//                 }
//             );
//             //Add id to currentusers following list
//             await currentRef.update(
//                 {
//                     follows : firebase.firestore.FieldValue.arrayUnion(target_id)
//                 }
//             );
//             hasFollowed({followsProfile: true, class:"follow yes"});

//         }else{
//             //Remove id from targetusers followers list
//             await targetRef.update(
//                 {
//                     followers : firebase.firestore.FieldValue.arrayRemove(currentUser)
//                 }
//             );
//             //Remove id from currentusers following list
//             await currentRef.update(
//                 {
//                     follows : firebase.firestore.FieldValue.arrayRemove(target_id)
//                 }
//             );
//             hasFollowed({followsProfile: false, class:"follow no"});

//         }
//     }
//     return {followed}
// }

// export default useFollowHook;