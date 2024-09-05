import React from "react";
import { Form } from "react-bootstrap";

const InputForm = ({
  value,
  placeholder,
  isDisabled,
  textArea,
  onChange,
  rows = 2,
  ...rest
}) => {
  return (
    <>
      {textArea ? (
        <Form.Control
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
          onChange={onChange}
          as="textarea"
          rows={rows}
          {...rest}
        />
      ) : (
        <Form.Control
          placeholder={placeholder}
          value={value}
          autoComplete={"off"}
          disabled={isDisabled}
          onChange={onChange}
          {...rest}
        />
      )}
    </>
  );
};

export default InputForm;
