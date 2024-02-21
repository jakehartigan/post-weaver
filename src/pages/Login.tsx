import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    }
  }, [currentUser, navigate]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // User is logged in
          // You can redirect the user to another page or update the UI as needed
          navigate("/dashboard"); // Redirect to dashboard after successful login
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage); // Set the error message to display to the user
        });
    } catch (error: any) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
