import io from "socket.io-client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import "../../App.css";

const socket = io.connect(import.meta.env.VITE_API_URL);

export default function InvitedChat() {
  const [userInvite, setUserInvite] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState("");

  const {id} = useParams();

  function errorText(text) {
    setError(text);
  }

  async function submitForm(e) {
    e.preventDefault();

    const RESPONSE = await fetch(`${import.meta.env.VITE_API_URL}/api/invited-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userInvite,
      }),
    });

    const RESULT = RESPONSE.json();

    if (RESPONSE.status === 200) {
      socket.emit("join_room", room);
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
          <form className="joinChatContainer w-100 px-2">
          <label htmlFor="userInvite" className="text-start w-100 mb-3 fw-bold">Your Username</label>
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
            <button type="submit" onClick={submitForm} className="mb-5">
              Join A Room
            </button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} username={userInvite} room={room} />
      )}
    </div>
  );
}
