import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "@mantine/core";

const Dashboard: React.FC = () => {
  // Initialize the Firebase auth instance
  const auth = getAuth();

  // Function to handle the logout process
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // You can redirect the user to the login page or perform other actions after logout
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle errors here, such as displaying a notification to the user
    }
  };

  return (
    <div>
      <div>Dashboard Page</div>
      <Button onClick={handleLogout}>Logout</Button> {/* Logout button */}
    </div>
  );
};

export default Dashboard;
