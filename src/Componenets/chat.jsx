import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
export default function Chat({ room }) {
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
      room: room,
    });

    setNewMessage("");
  };
  return (
    <div className="chat-container">
      <div className="friend-list">Friend</div>
      <div className="messages-container">
        {messages.map((message) => (
          <h1>{message.text}</h1>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
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
