import React from "react";

export default function Header({ notFunction }) {
  const onClick = () => {
    notFunction("n2lF6p7cNgU65uiEVWWACaNhNTH2");
  };
  return <button onClick={onClick}>PRESS</button>;
}
