import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import "../../App.css";

const socket = io.connect(import.meta.env.VITE_API_URL);
console.log(`${import.meta.env.VITE_API_URL}/api/user-invite`);
const username = localStorage.getItem("username");

export default function EnterChat() {
  const [userInvite, setUserInvite] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const RESPONSE = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user-invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitedUser: userInvite,
          username: username,
          roomId: room,
        }),
      }
    );
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
          <form className="joinChatContainer w-100 px-2">
            <label htmlFor="userInvite" className="text-start w-100 mb-3 fw-bold">Invitees&apos; Username</label>
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
            <label htmlFor="room-name" className="text-start w-100 mb-3 fw-bold">Chat Room ID</label>
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
            <button onClick={submitForm} className="mb-5">Join A Room</button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}
