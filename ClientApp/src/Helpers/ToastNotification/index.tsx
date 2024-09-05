import { toast } from "react-toastify";
import React from "react";
import "./index.css";

const notify = (type: Number, message: string | React.ReactNode) => {
  switch (type) {
    case 0:
      return toast.success(message, {
        autoClose: 2500,
      });
    case 1:
      return toast.error(message, {});
    default:
      break;
  }
};

export default notify;
