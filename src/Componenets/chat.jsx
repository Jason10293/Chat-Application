import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import Header from "./Header";
import FriendList from "./FriendList.";
import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  onSnapshot,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export default function Chat() {
  const [userInfo, setUserInfo] = useState({});

  const [room, setRoom] = useState("");
  const auth = getAuth();

  //Updates the DB with user's information and stores the information in state as well
  useEffect(() => {
    const updateDB = onAuthStateChanged(auth, async (user) => {
      //If user logged in
      if (user) {
        setUserInfo({
          uid: user.uid,
          displayName: user.displayName,
          pfp: user.photoURL,
        });
        //Queries the database and adds the user's information to the database
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
    //Orders the rooms by time created
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    //Updates the messages state when a new message is written
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

  function changeRoom(otherUserUid) {
    setRoom(otherUserUid);
  }

  // This function handles the submission of a new chat message.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newMessage === "") return;

    // Add a new document to the 'messagesRef' collection in Firestore.
    // The document contains the message text, the creation timestamp, the user's display name, user ID, profile picture URL, and the room in which the message is sent.
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
      pfp: auth.currentUser.photoURL,
      room: room,
    });

    // Clear the new message input field after the message is sent.
    setNewMessage("");
  };
  return (
    <div className="chat-container">
      <div className="header">
        <Header />
      </div>
      <FriendList userInfo={userInfo} />
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
