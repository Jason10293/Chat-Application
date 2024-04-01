import { useState, useRef } from "react";
import "./App.css";
import { Auth } from "./Componenets/Auth";
import Chat from "./Componenets/chat";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  if (!isAuth) {
    return (
      <ChakraProvider>
        <div>
          <Auth setIsAuth={setIsAuth} />
        </div>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider>
      <div>
        <Chat />
      </div>
    </ChakraProvider>
  );
}

export default App;
