import { useState } from "react";
import "../../App.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../common/Loader";

const API_BASE_URL = 'http://localhost:5000/api'; // Fetch base URL from environment variables

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.message) {
        sessionStorage.setItem("token", data.token); // Store JWT token
        sessionStorage.setItem("userId", data.userId); // Store user ID
        window.location.href="/dashboard"
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert("Server error. Please try again later.", error)
    } finally {
      setIsLoading(false)
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin(); // Call login function when Enter is pressed
    }
  };
  return (
    <div className="login-container">
      {isLoading && <Loader/>}
      <h2>Admin Login</h2>

      <div className="input-group">
        <FaUser className="icon" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      <div className="input-group">
        <FaLock className="icon" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
