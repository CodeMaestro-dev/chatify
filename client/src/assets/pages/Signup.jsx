import "../../App.css";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function inputText(text) {
    setInput(text);
  }

  function passwordText(text) {
    setPassword(text);
  }

  function usernameText(text) {
    setUsername(text);
  }

  function errorText(text) {
    setError(text);
  }

  function successText(text) {
    setSuccess(text);
  }

  async function submitForm(e) {
    e.preventDefault();
    setSuccess('')
    setError('')
    const RESPONSE = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: input,
        password: password,
      }),
    });

    const RESULT = await RESPONSE.json();
    if (RESPONSE.status === 200) {
      setTimeout(() => {
        window.location.href = "./otp";
      }, 3000);
      successText(RESULT.message)
    } else {
      console.log(RESULT.error);
      errorText(RESULT.error);
    }
  }

  return (
    <>
      <form className="container d-flex  flex-column  align-items-center mb-5 ">
        <div className="d-flex flex-column w-100 mb-1">
          <p className="text-danger text-center">{error}</p>
          <p className="text-success text-center">{success}</p>
          <label htmlFor="email" className="fw-bold mb-3">
            Your Email
          </label>
          <input
            type="email"
            name=""
            id="email"
            className="rounded-5 border-0 bg-dark-subtle signup-input"
            onInput={(e) => {
              inputText(e.target.value);
            }}
          />
        </div>
        <div className="d-flex flex-column w-100">
          <label htmlFor="username" className="fw-bold mb-3">
            Your Username
          </label>
          <input
            type="text"
            name=""
            id="username"
            className="rounded-5 border-0 bg-dark-subtle signup-input"
            onInput={(e) => {
              usernameText(e.target.value);
            }}
          />
        </div>
        <div className="d-flex flex-column w-100 mb-5">
          <label htmlFor="password" className="fw-bold mb-3">
            Your Password
          </label>
          <input
            type="password"
            name=""
            id="password"
            className="rounded-5 border-0 bg-dark-subtle signup-input"
            onInput={(e) => {
              passwordText(e.target.value);
            }}
          />
        </div>
        <div className="w-100 text-center ">
          <input
            type="submit"
            value="Sign Up"
            className="btn-chatify border-0 rounded-5 px-2 py-3 text-white w-100 mb-2"
            onClick={submitForm}
          />
          <Link to="/login">
            <p>Already have an account? Login</p>
          </Link>
        </div>
      </form>
    </>
  );
}
