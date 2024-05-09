import "../../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate()
  const [OTP, setOTP] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    navigate("/login");
  }

  function userOTP(number) {
    setOTP(number);
  }

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

    const RESPONSE = await fetch(`${import.meta.env.VITE_API_URL}/api/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: OTP,
      }),
    });

    const RESULT = await RESPONSE.json();
    if (RESPONSE.status === 200) {
      setTimeout(() => {
        setRedirect(true);
      }, 3000);
      successText(RESULT.message);
    } else {
      errorText(RESULT.error);
    }
  }

  return (
    <>
      <form className="container d-flex  flex-column  align-items-center mb-5 ">
        <div className="w-100">
          <p className="text-center">Code has being sent to your email</p>
          <p className="text-danger text-center">{error}</p>
          <p className="text-success text-center">{success}</p>

          <div className="d-flex gap-2 mb-4 div-otp w-100">
            <input
              type="number"
              name=""
              className="rounded-5 border-0 bg-dark-subtle signup-input w-100"
              onInput={(e) => {
                userOTP(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="w-100">
          <input
            type="submit"
            value="Verify OTP"
            className="btn-chatify border-0 rounded-5 px-2 py-3 text-white w-100"
            onClick={submitForm}
          />
        </div>
      </form>
    </>
  );
}
