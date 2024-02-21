import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../firebaseConfig";

const AuthStatus: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // State to store the current user object, typed as User or null
  const auth = getAuth(app);

  useEffect(() => {
    // This listener is called whenever the user's sign-in state changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the current user. It will be 'null' if the user is signed out.
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <div>
      {user ? (
        <p>Logged in as {user.email}</p> // Display user email if signed in
      ) : (
        <p>Not logged in</p> // Display "Not logged in" if signed out
      )}
    </div>
  );
};

export default AuthStatus;
