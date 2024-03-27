import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  onSnapshot,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
export default function Chat({ room }) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  useEffect(() => {
    const queryMessages = query(messagesRef, where("room", "==", room));
    onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      const unsubscribe = snapshot.forEach((doc) => {
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
    <div>
      <div>
        {messages.map((message) => (
          <h1>{message.text}</h1>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Type your message here"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
