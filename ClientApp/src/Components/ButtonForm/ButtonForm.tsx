import React from "react";
import { Button, ButtonProps } from "react-bootstrap";

const ButtonForm: React.FunctionComponent<ButtonProps> = ({
  id = "",
  value,
  disabled = false,
  ...rest
}) => {
  return (
    <Button type="button" id={id} disabled={disabled} {...rest}>
      {value}
    </Button>
  );
};

export default ButtonForm;
