import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import Header from "./Header";
import AddFriend from "./AddFriend";
import {
  doc,
  addDoc,
  collection,
  query,
  serverTimestamp,
  onSnapshot,
  where,
  orderBy,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import Friend from "./Friend";
export default function Chat() {
  const [userInfo, setUserInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [room, setRoom] = useState("");
  const auth = getAuth();
  useEffect(() => {
    const updateDB = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo({
          uid: user.uid,
          displayName: user.displayName,
          pfp: user.photoURL,
        });
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          await addDoc(usersRef, {
            displayName: user.displayName,
            email: user.email,
            pfp: user.photoURL,
            uid: user.uid,
          });
        }
      }
    });
    return () => updateDB();
  }, []);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  const usersRef = collection(db, "users");
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const updateMessages = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          id: doc.id,
          userId: doc.data().userId,
        });
      });
      setMessages(messages);
    });
    return () => updateMessages();
  }, [room]);

  function addFriend(otherDisplayName, otherPfp, otherUid) {
    if (otherUid === userInfo.uid) {
      console.log("Can't add yourself");
      return;
    }
    updateFriendList(otherUid, otherDisplayName, otherPfp);
    changeRoom(userInfo.uid);
  }
  async function updateFriendsList(
    uid,
    otherUid,
    otherDisplayName,
    otherPfp,
    roomId
  ) {
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(usersRef, querySnapshot.docs[0].id);
      const userDoc = await getDoc(docRef);

      await setDoc(
        docRef,
        {
          friendsList: {
            ...(userDoc.data()?.friendsList || {}),
            [otherUid]: {
              roomId: roomId,
              displayName: otherDisplayName,
              pfp: otherPfp,
            },
          },
        },
        { merge: true }
      );
    } else {
      console.log("Document does not exist");
    }
  }

  async function updateFriendList(otherUid, otherDisplayName, otherPfp) {
    const roomId = crypto.randomUUID();

    await updateFriendsList(
      userInfo.uid,
      otherUid,
      otherDisplayName,
      otherPfp,
      roomId
    );
    await updateFriendsList(
      otherUid,
      userInfo.uid,
      userInfo.displayName,
      userInfo.pfp,
      roomId
    );
  }
  const friendElements = friends.map((friend) => (
    <Friend displayName={friend.displayName} pfp={friend.pfp} />
  ));
  function changeRoom(otherUserUid) {
    setRoom(otherUserUid);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
      pfp: auth.currentUser.photoURL,
      room: room,
    });

    setNewMessage("");
  };
  return (
    <div className="chat-container">
      <div className="header">
        {/* Have change room function */}
        <Header notFunction={updateFriendList} />
      </div>
      <div className="friend-list">{friendElements}</div>
      <div className="user">
        <img src={userInfo.pfp} alt="" className="user-pfp" />
        <h3 className="display-name">{userInfo.displayName}</h3>
      </div>
      <div className="messages-container">
        {messages.map((message) => (
          <div className="message" key={message.id}>
            <div
              className={`message-${
                message.userId === userInfo.uid ? "curr-user" : "other-user"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <AddFriend addFriend={addFriend} />
      <form className="chat-message-form" onSubmit={handleSubmit}>
        <input
          placeholder="Type your message here"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          className="message-text-box"
        />
        <button type="submit" className="send-message-button">
          Send
        </button>
      </form>
    </div>
  );
}
