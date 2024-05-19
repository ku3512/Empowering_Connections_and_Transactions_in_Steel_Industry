import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function InputField({
    label,
    type,
    name,
    handleInput,
    value,
    validators,
    errorMessages,
    passwordIcon,
  
  }){
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-multiline-static"
          label={label}
          type={type}
          multiline
          rows={3}
          InputLabelProps={{ style: { fontSize: 11, fontWeight: "bolder" } }}
          InputProps={{
            sx: {
              fontSize: "12px",
            },
            endAdornment: passwordIcon,
          }}
        />
      </div>
    </Box>
  );
}