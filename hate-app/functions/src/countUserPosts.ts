const functions = require("firebase-functions");
const admin = require( "firebase-admin");
const FieldValue = require("firebase-admin").firestore.FieldValue;
exports.addUserPosts = functions.firestore
      .document("posts/{postId}")
      .onCreate((change, context) => {
        const authorId = context.params.author;
        const docRef = admin.firestore().collection("users").doc(authorId);
        docRef.update({postCount: FieldValue.increment(1)});
      });


exports.decreaseUserPosts = functions.firestore
      .document("posts/{postId}")
      .onDelete((change, context) => {
        const authorId = context.params.author;
        const docRef = admin.firestore().collection("users").doc(authorId);
        docRef.update({postCount: FieldValue.increment(-1)});
      });

