import React from "react";
import { TextValidator } from "react-material-ui-form-validator";

export default function InputField({
  label,
  type,
  name,
  handleInput,
  value,
  validators,
  errorMessages,
  passwordIcon,
  status,
  docStatus
  
}) {
  return (
    <>
      <TextValidator
        onChange={(e) => {
          handleInput(e);
        }}
        type={type}
        value={value}
        validators={validators}
        errorMessages={errorMessages}
        sx={{width: "100%" }}
        id={name}
        // required
        label={label}
        name={name}
        InputProps={{
          sx: {
            height: "60px",
            fontSize: 15,
          },
          endAdornment: passwordIcon,
        }}
        InputLabelProps={{ style: { fontSize: 15 } }}
        disabled={docStatus === 1 || status === "Withdrawn"} 
        
      />
    </>
  );
}
