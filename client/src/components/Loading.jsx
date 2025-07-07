import React from "react";

const Loading = ({ color = "danger" }) => {
  return (
     <div className="d-flex justify-content-center">
  <div className={`spinner-border text-${color}`} role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>
  );
};

export default Loading;

