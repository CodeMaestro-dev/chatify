import { Link } from "react-router-dom";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.css";
import Button from "./Button";


export default function App() {
  return (
    <div className="home-page">
      <div className="d-flex gap-2">
        <Link to="/signup">
          <Button text={"Signup"} />
        </Link>
        <Link to="/login">
          <Button text={"Login"} />
        </Link>
      </div>
      <p className="app-text fs-2 text-center">
        Welcome to Chatify. The Gen-Z chatting application
      </p>
    </div>
  );
}
