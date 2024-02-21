import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import AuthStatus from "../components/AuthStatus";
import { useAuth } from "../contexts/AuthContext";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  //MoveUser to Dashboard if their status is logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Initialize the Firebase auth instance
    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // User is signed up, now add additional info to Firestore
          const user = userCredential.user;
          setDoc(doc(db, "users", user.uid), {
            email: user.email,
            username: username,
            role: "coach", // or "client", depending on the signup context
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        });
    } catch (error: any) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h2>Coach Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
