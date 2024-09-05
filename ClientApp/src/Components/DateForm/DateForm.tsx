import React from "react";
import "./DateForm.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import TextField from "@mui/material/TextField";

const DateForm = ({ isDisabled, value, onChange, ...rest }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        disabled={isDisabled}
        value={value}
        disableMaskedInput
        className="w-100 bg-white"
        onChange={onChange}
        inputFormat="dd-MMM-yyyy"
        renderInput={(params) => (
          <TextField size="small" name="paValue" {...params} />
        )}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DateForm;
