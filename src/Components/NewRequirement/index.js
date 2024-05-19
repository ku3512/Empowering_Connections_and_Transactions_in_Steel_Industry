import React, { useState, useEffect } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Card, Typography, Grid, TextField, Box, FormControlLabel, Checkbox } from '@mui/material';
import Button from '@mui/material/Button';
import SelectInputField from '../../Common_Components/InputField/SelectInputField';
import { useNavigate } from 'react-router-dom';
import RequirementDetails from '../NewRequirementDetails';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const NewRequirement = () => {
  const DefaultRole = JSON.parse(localStorage.getItem("roleProfile"));
  const navigate = useNavigate();
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [role, setRole] = useState('');
  const [checkBoxVal, setCheckBoxVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [postRequirement, setPostRequirement] = useState({
    requirement_type: '',
    requirement_details: "",
    category: "",
  })

  useEffect(() => {
    const categoryData = () => {
      const key = JSON.parse(localStorage.getItem('key'));
      const secret = JSON.parse(localStorage.getItem('secret'));
      setLoading(true);
      fetch('https://steel.smartyerp.in/api/method/steel.api.get_category', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${key}:${secret}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCategories(data.data);
          console.log(data.data)
          setLoading(false);
        })
        .catch((error) => {
          console.error(error)
          setLoading(false);
        });
    };

    categoryData();
  }, []);

  useEffect(() => {
    if (DefaultRole === "Buyer") {
      setRole("Buy");
    } else if (DefaultRole === "Seller") {
      setRole("Sale");
    }

    if (DefaultRole === "Both") {
      setShowCheckboxes(true);
    }
  }, []);

  const InputFiledData = (e) => {
    setPostRequirement({ ...postRequirement, [e.target.name]: e.target.value });
  };

  const checkboxData = (e) => {
    const checkboxValue = e.target.value;
    setCheckBoxVal(checkboxValue);

    if (checkboxValue === "Buy") {
      setRole("Buy");
    } else if (checkboxValue === "Sale") {
      setRole("Sale");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      ...postRequirement,
      requirement_type: "I want to " + role,
    };
    setLoading(true);

    navigate('/newrequirementdetails', { state: { data } });
  };

  const handleBack = () => {
    navigate("/");
  };

  const isFormValid = postRequirement.category && postRequirement.requirement_details.trim() !== '' && role;

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: {xs:"auto",sm:"900px"},
            mt: 12,
            ml:{xs:0,sm:30},
            mx: "auto",
            p:3,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
            "@media screen and (max-width: 600px)": {
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              width: "50%",
              "@media screen and (max-width: 600px)": {
                width: "100%",
              },
            }}
          >
            <ValidatorForm onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                    {/* I want To <span style={{ color: "blue" }}>{role}</span> */}
                    {showCheckboxes && (
                      <>
                        <span style={{ marginLeft: "10px" }}>
                          <FormControlLabel
                            control={<Checkbox onChange={checkboxData} name="Buy" value="Buy" />}
                            label="Buy"
                            checked={role === "Buy"}
                            disabled={role === "Sale"}
                          />
                          <FormControlLabel
                            control={<Checkbox onChange={checkboxData} name="Sale" value="Sale" />}
                            label="Sale"
                            checked={role === "Sale"}
                            disabled={role === "Buy"}
                          />
                        </span>
                      </>
                    )}
                  </Typography>
                </Grid>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    textAlign: "start",
                    fontWeight: "bold",
                    margin: "16px",
                    fontSize: "25px",
                  }}
                >
                  Post Requirement to <span style={{ color: "blue" }}>{role}</span>
                </Typography>
                <Grid item xs={12}>
                  <SelectInputField
                    name="category"
                    label="Item Category"
                    selectOptions={categories.map((option) => ({
                      value: option.name,
                      label: option.name,
                    }))}
                    value={postRequirement.name}
                    handleInput={InputFiledData}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    sx={{ width: "100%", mt: 2 }}
                    name="requirement_details"
                    label="Requirement Details"
                    value={postRequirement.requirement_details}
                    onChange={InputFiledData}
                    multiline
                    rows={4}
                    InputProps={{ sx: { fontSize: 15 } }}
                    InputLabelProps={{ style: { fontSize: 15 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleBack} variant="contained" sx={{ m: 1, float: "left" }}>
                    Back
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ m: 1, float: "right" }}
                    disabled={!isFormValid}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </ValidatorForm>
          </Box>
        </Box>

      )}
    </>
  );
};

export default NewRequirement;
