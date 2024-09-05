import { Spinner } from "react-bootstrap";
import "./Loader.css";
import { FunctionComponent } from "react";

const Loader: FunctionComponent = () => {
  return (
    <>
      <div className="spinner">
        <Spinner animation="border" variant="secondary" />
      </div>
    </>
  );
};

export default Loader;
