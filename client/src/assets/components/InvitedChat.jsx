import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import "../../App.css";

const socket = io.connect(import.meta.env.VITE_API_URL);

export default function InvitedChat() {
  const [userInvite, setUserInvite] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userInvite !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  async function submitForm(e) {
    e.preventDefault();
    joinRoom()
  }

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Welcome to Chatify.</h3>
          <label htmlFor="userInvite">Your Username</label>
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
            <button type="submit" onClick={submitForm}>Join A Room</button> 
          </form>
        </div>
      ) : (
        <Chat socket={socket} username={userInvite} room={room} />
      )}
    </div>
  );
}
