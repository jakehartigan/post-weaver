import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "../src/pages/Signup"; // Adjust the path as necessary
import Login from "../src/pages/Login"; // Adjust the path as necessary
import Dashboard from "../src/pages/Dashboard"; // Adjust the path as necessary
import PageNotFound from "./pages/PageNotFound";

const App: React.FC = () => {
  return (
    <Router>
      {/* Remove this nav after creating auth flow */}
      <nav>
        <ul>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
