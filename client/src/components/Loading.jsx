import React from "react";

const Loading = ({ color = "danger" }) => {
  return (
    <button className={`btn btn-${color}`} type="button" disabled>
      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
      <span className="visually-hidden" role="status">Loading...</span>
    </button>
  );
};

export default Loading;

