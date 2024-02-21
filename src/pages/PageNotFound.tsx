import React from "react";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
  return (
    <div>
      404 No pages here
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default PageNotFound;
