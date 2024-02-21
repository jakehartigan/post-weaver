import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "../src/pages/Signup";
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import "./firebaseConfig";

const App: React.FC = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("Current user: ", currentUser);
  }, [currentUser]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
