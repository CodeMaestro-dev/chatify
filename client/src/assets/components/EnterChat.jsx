import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import "../../App.css";

const socket = io.connect(import.meta.env.VITE_API_URL);

export default function EnterChat() {
  const [userInvite, setUserInvite] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const username = localStorage.getItem("username");

  function errorText(text) {
    setError(text);
  }

  function successText(text) {
    setSuccess(text);
  }

  async function submitForm(e) {
    e.preventDefault();
    setSuccess("");
    setError("");
    const RESPONSE = await fetch("http://localhost:3000/api/user-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invitedUser: userInvite,
        roomId: room,
      }),
    });
    const RESULT = await RESPONSE.json();

    if (RESPONSE.status == 200) {
      socket.emit("join_room", room);
      successText(RESULT.message);
      setShowChat(true);
    } else {
      errorText(RESULT.error);
    }
  }

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Welcome to Chatify.</h3>
          <p className="text-danger text-center">{error}</p>
          <p className="text-success text-center">{success}</p>
          <label htmlFor="userInvite">Invitees&apos; Username</label>
          <form className="joinChatContainer">
            <input
              type="text"
              placeholder="johndoe"
              id="userInvite"
              className="mb-3"
              onChange={(event) => {
                {
                  setUserInvite(event.target.value);
                }
              }}
            />
            <label htmlFor="room-name">Chat Room ID</label>
            <input
              id="room-name"
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                {
                  setRoom(event.target.value);
                }
              }}
            />
            <button onClick={submitForm}>Join A Room</button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}
