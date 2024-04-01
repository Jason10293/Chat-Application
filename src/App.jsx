import { useState, useRef } from "react";
import "./App.css";
import { Auth } from "./Componenets/Auth";
import Chat from "./Componenets/chat";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }
  return (
    <div>
      <Chat />
    </div>
  );
}

export default App;
