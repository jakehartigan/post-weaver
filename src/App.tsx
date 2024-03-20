import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
// other css files are required only if
// you are using components from the corresponding package
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

import PrivateRoute from "./components/authNavigation/PrivateRoute";
import Signup from "../src/pages/Signup";
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import "./firebaseConfig";
import Home from "./pages/Home";
import Billing from "./pages/Billing";
import Support from "./pages/Support";
import Tokens from "./pages/Tokens";
import Settings from "./pages/Settings";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const App: React.FC = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("Current user: ", currentUser);
  }, [currentUser]);

  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
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
    </MantineProvider>
  );
};

export default App;
