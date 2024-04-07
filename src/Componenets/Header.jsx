import React from "react";

export default function Header({ notFunction }) {
  const onClick = () => {
    notFunction();
  };
  return <button onClick={onClick}>PRESS</button>;
}
