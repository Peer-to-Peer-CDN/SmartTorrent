import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const ProgressBarCustom = () => {
  const now = 60;

  return (
    <div>
      <ProgressBar now={now} label={`${now}%`} />
    </div>
  );
};

export default ProgressBarCustom;
  