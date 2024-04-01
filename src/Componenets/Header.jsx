import React from "react";

export default function Header({ onClick }) {
  return (
    <div>
      <h1>Hello</h1>
      <button onClick={onClick}>PRESS ME</button>
    </div>
  );
}
