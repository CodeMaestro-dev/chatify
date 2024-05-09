import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./assets/components/Home";
import EnterChat from "./assets/components/EnterChat";
import Login from "./assets/pages/Login";
import Signup from "./assets/pages/Signup";
import OTP from "./assets/pages/OTP";
import Navbar from "./assets/components/Navbar";
import InvitedChat from "./assets/components/InvitedChat"

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<EnterChat />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/chat/*" element={<InvitedChat />} />
        <Route path="*" element={<Navigate to="/chat/*" />} />
      </Routes>
    </>
  );
}
