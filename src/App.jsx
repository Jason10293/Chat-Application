import { useState, useRef } from "react";
import "./App.css";
import { Auth } from "./Componenets/Auth";
import Chat from "./Componenets/chat";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          background: "",
          margin: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
          color: "white",
        },
      },
    },
  });
  if (!isAuth) {
    return (
      <ChakraProvider theme={theme}>
        <div>
          <Auth setIsAuth={setIsAuth} />
        </div>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider theme={theme}>
      <div>
        <Chat />
      </div>
    </ChakraProvider>
  );
}

export default App;
