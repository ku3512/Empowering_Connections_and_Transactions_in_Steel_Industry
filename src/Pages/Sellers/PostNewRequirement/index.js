import React, { useState, useEffect } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SelectInputField from '../../../Common_Components/InputField/SelectInputField';
import { toast, ToastContainer } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';


const PostNewRequirement = () => {

  const today = dayjs();
  const endTime = dayjs(today).set('hour', 16).set('minute', 0).set('second', 0);
  const tomorrow = dayjs(today).add(1, 'day');
  const defaultDateTime = today.isBefore(endTime)
    ? dayjs(today).set('hour', 19).set('minute', 30).set('second', 0) // Set default time to 7:30 PM
    : dayjs(tomorrow).set('hour', 19).set('minute', 30).set('second', 0);

  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);


  const navigate = useNavigate()

  const DefaultRole = "Seller";
  const [requirementDetailsLength, setRequirementDetailsLength] = useState(0);
  const [categorySelected, setCategorySelected] = useState(false);
  const [postRequirement, setPostRequirement] = useState({
    requirement_type: "",
    requirement_details: "",
    category: "",
  })

  const [citys, setCitysData] = useState([]);
  const [loadingbtn, setLoadingBtn] = useState(false);
  const [paymentTermsData, setPaymentTermsData] = useState([]);
  const [RequiredForm, setRequiredForm] = useState({
    payment_terms: '',
    remarks: '',
    delivery_at: '',
    expiration_date: defaultDateTime.format("YYYY-MM-DD HH:mm:ss"),
  })

  const handleDateTimeChange = (newDateTime) => {
    if (newDateTime) { // Check if a valid date and time is selected
      setRequiredForm((prevState) => ({
        ...prevState,
        expiration_date: formatDateTime(newDateTime),
      }));
    }
  };

  const formatDateTime = (dateTime) => {
    if (dateTime) {
      return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
    }
    return '';
  };


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
          setLoading(false);
        })
        .catch((error) => {
          console.error(error)
          setLoading(false);
        });
    };
    const PaymentTermData = () => {
      const key = JSON.parse(localStorage.getItem('key'));
      const secret = JSON.parse(localStorage.getItem('secret'));
      fetch('https://steel.smartyerp.in/api/method/steel.api.get_payment_terms', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${key}:${secret}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setPaymentTermsData(data.data);
        })
        .catch(error => console.error(error));
    };
  
    const CityData = () => {
      const key = JSON.parse(localStorage.getItem('key'));
      const secret = JSON.parse(localStorage.getItem('secret'));
      fetch('https://steel.smartyerp.in/api/method/steel.api.get_city', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${key}:${secret}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setCitysData(data.data);
        })
        .catch(error => console.error(error));
    }

    categoryData();
    CityData();
    PaymentTermData();
  }, []);

  useEffect(() => {
    if (DefaultRole === "Buyer") {
      setRole("Buy");
    } else if (DefaultRole === "Seller") {
      setRole("Sale");
    }
  }, []);


  const handleRequirementDetailsChange = (e) => {
    const value = e.target.value;
    setPostRequirement({ ...postRequirement, requirement_details: value });
    setRequirementDetailsLength(value.trim().length);
  };


  const InputFiledData = (e) => {
    setPostRequirement({ ...postRequirement, [e.target.name]: e.target.value });
    setRequiredForm({ ...RequiredForm, [e.target.name]: e.target.value })
    setCategorySelected(e.target.name === "category" && e.target.value !== "");
  };


  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const newdata = {
  //     ...postRequirement,
  //     requirement_type: "I want to " + role

  //   };
  //   setLoading(true);

  //   if (postRequirement.category === "Angle") {
  //     navigate('/angle', { state: { newdata } });
  //   } else if (postRequirement.category === "Coil") {
  //     navigate('/coil', { state: { newdata } });
  //   } else if (postRequirement.category === "Flat") {
  //     navigate('/flat', { state: { newdata } });
  //   } else if (postRequirement.category === "Round Pipe") {
  //     navigate('/roundpipe', { state: { newdata } });
  //   } else if (postRequirement.category === "Square Pipe") {
  //     navigate('/squarepipe', { state: { newdata } });
  //   } else if (postRequirement.category === "Round Rod") {
  //     navigate('/roundrod', { state: { newdata } });
  //   } else if (postRequirement.category === "Square/Hex Rod") {
  //     navigate('/squarerod', { state: { newdata } });
  //   } else if (postRequirement.category === "Sheet/Plate") {
  //     navigate('/sheetplate', { state: { newdata } });
  //   } else if (postRequirement.category === "Wire") {
  //     navigate('/wire', { state: { newdata } });
  //   } else {
  //     toast.warn("Please choose the correct category!");
  //   }
  // };


  const AddAllRequirements = async (e) => {
    e.preventDefault();

    const newdata = {
      ...postRequirement,
      ...RequiredForm,
      requirement_type: "I want to " + role

    };

    setLoadingBtn(true);
    setLoading(true);
    const key = JSON.parse(localStorage.getItem('key'));
    const secret = JSON.parse(localStorage.getItem('secret'));
    try {
      const response = await fetch(
        "https://steel.smartyerp.in/api/method/steel.api.create_whatsapp_requirement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          },
          body: JSON.stringify(newdata),
        }
      );
      const data = await response.json();

      if (data.status_code === 200) {
        toast.success(data.message);
        setTimeout(() => {
        navigate("/sellerpost")
        }, 1500);
      } else {
        toast.error(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      setLoading(false);
      setLoadingBtn(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setLoadingBtn(false);
    }

  };

  // const isTypeFarsiDisabled = requirementDetailsLength >= 1;
  // const isRequirementDetailsValid = postRequirement.requirement_details.trim().length >= 1;
  const isFormValid = postRequirement.category && postRequirement.requirement_details !== ''
   && RequiredForm.payment_terms !== '' &&
    role;

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="inherit" />
          <Typography variant="h5" color="inherit" sx={{ ml: 2, color: "white" }}>
            {loadingbtn === true ? "Sending to AI to Analyse..." : "Please Wait"}
          </Typography>
        </Box>
      ) : (
        <Box sx={{
          width: "auto",
          mt: 10,
          mb: 8,
          ml: { xs: 2, sm: 28 },
          mr: { xs: 2, sm: 10 },
          display: "flex",
          flexDirection: "column",
        }}>
          <ToastContainer />
          <ValidatorForm
          //  onSubmit={handleSubmit}
           >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                textAlign: "start",
                fontWeight: "bold",
                marginTop: "10px",
                marginBottom: "10px",
                fontSize: "25px",
              }}
            >
               Post Requirement for {role}
            </Typography>
            {/* main box */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 5 }}>
              {/* left side box */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                </Box>

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

                {/* for Sheet/Plate */}
                {postRequirement.category === "Sheet/Plate" && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                      Format:
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>&nbsp;
                      [Grade] [Thickness] [Width] [Length] [Finish] [Make] [Quantity]
                    </Typography>
                  </div>
                )}
                {/* for Coil */}
                {postRequirement.category === "Coil" && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                      Format:
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>&nbsp;
                      [Grade] [Thickness] [Width] [Finish] [Make] [Quantity]
                    </Typography>
                  </div>
                )}
                {/* for Round Pipe */}
                {postRequirement.category === "Round Pipe" && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>Format:</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>
                      [Grade] [NB/OD] [ERW/Seamless] [Diameter] [Thickness] [Length] [Finish] [Make] [Quantity]
                    </Typography>
                  </div>
                )}
                {/* for Square Pipe */}
                {postRequirement.category === "Square Pipe" && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                      Format:
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>&nbsp;
                      [Grade] [Size-1] [Size-2] [Thickness] [Length] [Finish] [Make] [Quantity]
                    </Typography>
                  </div>
                )}
                {/* for Flat and Angle */}
                {(postRequirement.category === "Flat" ||
                  postRequirement.category === "Angle") && (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                        Format:
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>&nbsp;
                        [Grade] [Width] [Thickness] [Length] [Finish] [Make] [Quantity]
                      </Typography>
                    </div>
                  )}
                {/* for Round Rod */}
                {postRequirement.category === "Round Rod" && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                      Format:
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>&nbsp;
                      [Grade] [Diameter] [Length] [Finish] [Make] [Quantity]
                    </Typography>
                  </div>
                )}
                {/* for Square/Hex Rod */}
                {postRequirement.category === "Square/Hex Rod" && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                      Format:
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>&nbsp;
                      [Grade] [Shape] [Size] [Length] [Finish] [Make] [Quantity]
                    </Typography>
                  </div>
                )}
                {/* for Wire */}
                {postRequirement.category === "Wire" && (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                      Format :
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: "bold", color: "#FF6347" }}>&nbsp;
                      [Grade] [Diameter] [Length] [Make] [Hardness Type] [Quantity]
                    </Typography>
                  </div>
                )}
                <TextField
                  sx={{ width: "100%" }}
                  name="requirement_details"
                  label="Requirement Details"
                  value={postRequirement.requirement_details}
                  onChange={handleRequirementDetailsChange}
                  multiline
                  rows={3}
                  InputProps={{ sx: { fontSize: 15 } }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                />
              </Box>

              {/* right side box */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, mt: { xs: 0, sm: 2 } }}>
                <SelectInputField
                  name="payment_terms"
                  label="Payment Terms"
                  selectOptions={paymentTermsData.map(option => ({
                    value: option.payment_term,
                    label: option.payment_term
                  }))}
                  handleInput={InputFiledData}
                  value={RequiredForm.payment_terms}
                />
                <SelectInputField
                  name="delivery_at"
                  label="Delivery at"
                  selectOptions={citys.map(option => ({
                    value: option.city,
                    label: option.city
                  }))}
                  handleInput={InputFiledData}
                  value={RequiredForm.delivery_at}
                />
                <TextField
                  name="remarks"
                  id="outlined-multiline-static"
                  label="Remarks"
                  onChange={InputFiledData}
                  value={RequiredForm.remarks}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <DateTimePicker
                      label="Expiration Date"
                      value={dayjs(RequiredForm.expiration_date)}
                      onChange={handleDateTimeChange}
                      disablePast
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      format="DD-MM-YYYY HH:mm A"
                      renderInput={(props) => <TextField {...props} />}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <Typography sx={{ fontSize: 13 }}>Expiry Date at 19:30 IST by default. Pre-4 PM posts expire today, while post-4 PM posts expire next day at 19:30 IST.</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mt:{xs:2,sm:-10}}}>
              {/* <Button
                type='submit'
                variant="contained"
                color="secondary"
                disabled={!categorySelected || isTypeFarsiDisabled}
              > Manual Data Entry (No AI)</Button> */}
              <Button
                variant="contained"
                color="success"
                onClick={AddAllRequirements}
                disabled={!isFormValid
                  // || !isRequirementDetailsValid
                }
              >Submit</Button>
            </Box>
          </ValidatorForm>
        </Box>
      )}
    </>
  )
}
export default PostNewRequirement;
