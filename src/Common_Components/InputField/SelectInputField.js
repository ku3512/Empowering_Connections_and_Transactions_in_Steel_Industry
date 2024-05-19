import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import MenuItem from "@mui/material/MenuItem";
export default function SelectInputField({
  label,
  type,
  name,
  handleInput,
  value,
  passwordIcon,
  selectOptions,
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
        sx={{  width: "100%" }}
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
        select
        disabled={docStatus === 1 || status === "Withdrawn"} 
        
      >
      {selectOptions.map((option) => (
            <MenuItem value={option.value}>{option.label}</MenuItem>
          ))}
          </TextValidator>
    </>
  );
}
