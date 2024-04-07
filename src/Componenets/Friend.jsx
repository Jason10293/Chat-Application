import React, { useState } from "react";

export default function Friend({ displayName, pfp }) {
  return (
    <div>
      <button className="friend-button">
        <img src={pfp} alt="Profile" />
        <h1>{displayName}</h1>
      </button>
    </div>
  );
}
