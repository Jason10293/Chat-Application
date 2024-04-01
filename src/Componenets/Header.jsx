import React from "react";

export default function Header({ onClick }) {
  return (
    <div>
      <button onClick={onClick}>PRESS ME</button>
    </div>
  );
}
