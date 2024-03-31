import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
export default function Chat({ room }) {
  const [uid, setUid] = useState("");
  const [userPfp, setUserPfp] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUserPfp(user.photoURL);
        setUserDisplayName(user.displayName);
      }
    });
  }, []);
  console.log(userPfp);
  console.log(userDisplayName);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          id: doc.id,
          userId: doc.data().userId,
        });
        setMessages(messages);
      });
    });
    return () => unsubscribe();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
      room: room,
    });
    setNewMessage("");
  };
  return (
    <div className="chat-container">
      <div className="header">Hello</div>
      <div className="friend-list">Friend</div>
      <div className="user">
        <img src={userPfp} alt="" className="user-pfp" />
        <h3 className="display-name">{userDisplayName}</h3>
      </div>
      <div className="messages-container">
        {messages.map((message) => (
          <div className="message" key={message.id}>
            <div
              className={`message-${
                message.userId === uid ? "curr-user" : "other-user"
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
