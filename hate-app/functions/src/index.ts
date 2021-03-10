import * as functions from "firebase-functions";
import admin = require( "firebase-admin");
admin.initializeApp(functions.config().firebase);


exports.aggregateComments = functions.firestore
    .document("posts/{postId}/comments/{commentId}")
    .onWrite((change, context) => {
      const postId = context.params.postId;
      console.log(context.params);
      const docRef = admin.firestore().collection("posts").doc(postId);

      return docRef.collection("comments").orderBy("createdAt", "desc")
          .get()
          .then((querySnapshot) => {
            const commentCount = querySnapshot.size;
            const recentComments: FirebaseFirestore.DocumentData[] = [];


            querySnapshot.forEach((doc) => {
              recentComments.push(doc.data());
            });

            recentComments.splice(5);

            const lastActivity = recentComments[0].createdAt;

            const data = {commentCount, recentComments, lastActivity};

            return docRef.update(data);
          })
          .catch((err) => console.log(err));
    });


