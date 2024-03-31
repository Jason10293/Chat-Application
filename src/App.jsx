import { useState, useRef } from "react";
import "./App.css";
import { Auth } from "./Componenets/Auth";
import Chat from "./Componenets/chat";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);
  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }
  return (
    <div>
      {room ? (
        <Chat room={room} />
      ) : (
        <div className="room-selection">
          <label className="room-input-text">Enter Room Name:</label>
          <input
            placeholder="Enter Room Name"
            className="room-input"
            ref={roomInputRef}
          />
          <button
            className="enter-chat-button"
            onClick={() => setRoom(roomInputRef.current.value)}
          >
            Enter Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
