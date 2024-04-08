import React, { useState, useEffect } from "react";
import {
  doc,
  query,
  where,
  setDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import Friend from "./Friend";
import { db } from "../firebase-config";
import AddFriend from "./AddFriend";
export default function FriendList({ userInfo }) {
  const [friends, setFriends] = useState([]);
  const usersRef = collection(db, "users");
  async function updateFriendsList(uid, otherUid, otherDisplayName, otherPfp) {
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    // Generate a random room ID that both users will use when talking to each other
    const roomId = crypto.randomUUID();
    if (!querySnapshot.empty) {
      const docRef = doc(usersRef, querySnapshot.docs[0].id);
      const userDoc = await getDoc(docRef);
      // Update the user document with the new friend's information
      await setDoc(
        docRef,
        {
          friendsList: {
            // Spread the existing friends list, or an empty object if it doesn't exist
            ...(userDoc.data()?.friendsList || {}),
            // Add the new friend's information
            [otherUid]: {
              roomId: roomId,
              displayName: otherDisplayName,
              pfp: otherPfp,
            },
          },
        },
        // Updates existing documents with any new information, or creates one if one doens't exist
        { merge: true }
      );
    } else {
      console.log("Document does not exist");
    }
  }
  async function updateBothUsersFriendsList(
    otherUid,
    otherDisplayName,
    otherPfp,
    roomId
  ) {
    // Update the friends list of the current user with the other user's information
    await updateFriendsList(
      userInfo.uid,
      otherUid,
      otherDisplayName,
      otherPfp,
      roomId
    );
    // Update the friends list of the other user with the current user's information
    await updateFriendsList(
      otherUid,
      userInfo.uid,
      userInfo.displayName,
      userInfo.pfp,
      roomId
    );
  }
  async function addFriend(otherDisplayName, otherPfp, otherUid) {
    if (otherUid === userInfo.uid) {
      console.log("Can't add yourself");
      return;
    }
    //Updates both user's friend's lists in the database and reflects this change in the UI
    updateBothUsersFriendsList(otherUid, otherDisplayName, otherPfp);
    await updateFriendListUI();
  }
  // Updates the UI with the current user's friends list
  async function updateFriendListUI() {
    const q = query(usersRef, where("uid", "==", userInfo.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return;
    }
    // Get the friends list from the user document
    const userData = querySnapshot.docs[0].data();
    if (!userData.hasOwnProperty("friendsList")) {
      console.log("Hello");
      return;
    }
    const userFriendList = userData.friendsList;
    // Convert the friends list object to an array of [key, value] pairs
    let userPropertiesArr = Object.entries(userFriendList);
    // Map over the array and for each friend get the friend's display name and profile picture
    userPropertiesArr.map((user) => {
      // In this context, 'user' is an array where the first element (index 0) is the key (user ID) and the second element (index 1) is the value (user object).
      // Use [1] to access the values of the user objects
      const displayName = user[1].displayName;
      const pfp = user[1].pfp;
      // Update the friends state with a new Friend component for the new friend, repeat for each friend in the user's friend list
      setFriends((prevValue) => {
        return [...prevValue, <Friend displayName={displayName} pfp={pfp} />];
      });
    });
  }
  useEffect(() => {
    // Define an asynchronous function to fetch and update the friend list
    const fetchAndUpdateFriendList = async () => {
      await updateFriendListUI();
    };

    fetchAndUpdateFriendList();
  }, [userInfo]);
  return (
    <div className="friend-list-container">
      <div className="friend-list">{friends}</div>
      <AddFriend addFriend={addFriend} />
    </div>
  );
}
