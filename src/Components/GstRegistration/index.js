import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import OtpRegister from '../OtpRegister';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import { green, red } from '@mui/material/colors';


const GstRegistration = () => {

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [numLoading, setNumLoading] = useState(false);
    const [gstLoading, setGstLoading] = useState(false);
    const [gstMessageColor, setGstMessageColor] = useState('');
    const [dataReceived, setDataReceived] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [validGST, setValidGST] = useState(false);
    const [verificationComplete, setVerificationComplete] = useState(false);
    const [GSTmessage, setGSTMessage] = useState("");
    const [mobileButtonVisible, setmobileButtonVisible] = useState(true);
    const [gstButtonVisible, setGstButtonVisible] = useState(true);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [checkboxes, setCheckboxes] = useState({
        buyer: false,
        seller: false
    });
    const [mobileNumber, setMobileNumber] = useState('');
    
    const [formData, setFormData] = useState({
        gst_no: "",
        mobile: mobileNumber,
        first_name: "",
        email: `${mobileNumber}@example.com`,
        account_type: "",
        pan_no: "",
        address: ""
    });
    const [data, setData] = useState({});

    //checkboxes
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxes({
            ...checkboxes,
            [name]: checked
        });
    };

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            email: `${mobileNumber}@example.com`
        }));
    }, [mobileNumber]);

    //mobile number
    const handleMobileNumberChange = (event) => {
        const mobile = event.target.value;
        setMobileNumber(mobile);
        setFormData((prevState) => ({ ...prevState, mobile }));
        setError(!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile));
      };

    //gst number
    const handleGstNumber = (event) => {
        setFormData((prevState) => ({ ...prevState, gst_no: event.target.value }));
        setError(!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(event.target.value));
        setIsVerifying(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(event.target.value));
    };


    async function fetchData() {
        try {
            const response = await axios.get('https://steel.smartyerp.in/api/method/steel.v1.login.get_company_from_gstn', {
                params: { gstin: formData.gst_no }
            });
            if (response.data.status_code === 404) {
                setValidGST(false);
                setGSTMessage(response.data.message);
                setGstMessageColor(red[500]);
            } else if (response.data.status_code === 200) {
                if (response.data.data) {
                    setValidGST(true);
                    setGSTMessage(response.data.message);
                    setGstMessageColor(green[500]);
                    setData(response.data.data);
                    setDataReceived(true);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                // Handle other status codes if needed
                setData(response.data.data);
            }
            setVerificationComplete(true);

        } catch (error) {
            console.error(error);
            setData({});
        }
    }

    const handleCheckNumber = () => {
        setNumLoading(true);
        setInputDisabled(true);
        fetch('https://steel.smartyerp.in/api/method/steel.v1.login.verify_gst_and_mobile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mobile: mobileNumber })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status_code === 200) {
                    setStatusCode(data.status_code);
                    setmobileButtonVisible(false);
                } else {
                    toast.error(data.message)
                }
            })
            .catch(error => console.error(error))
            .finally(() => {
                setNumLoading(false);
            });
    };

    const handleCheckGst = () => {
        setGstLoading(true);
        fetch('https://steel.smartyerp.in/api/method/steel.v1.login.verify_gst_and_mobile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gst_no: formData.gst_no})
        })
            .then(response => response.json())
            .then(data => {
                if (data.status_code === 200) {
                    fetchData();
                    setGstButtonVisible(false);
                } else {
                    toast.error(data.message)
                }
            })
            .catch(error => console.error(error))
            .finally(() => {
                setGstLoading(false);
            });
    };



    const handleSubmit = (event) => {
        setIsLoading(true);
        event.preventDefault();
        // if (!checkboxes.buyer && !checkboxes.seller) {
        //     toast.warn("Please select at least one option.");
        //     return;
        // }
        let selectedOptions = "";
        if (checkboxes.buyer && checkboxes.seller) {
            selectedOptions = "Both";
        } else if (checkboxes.buyer) {
            selectedOptions = "Buyer";
        } else if (checkboxes.seller) {
            selectedOptions = "Seller";
        }

        const allData = {
            ...formData,
            account_type: selectedOptions,
            company_name: data.trade_name,
            first_name: data.trade_name,
            pan_no: data.pan_number,
            address: data.business_address
        };

        const mobile = formData.mobile
        const apiUrl = `https://steel.smartyerp.in/api/method/steel.v1.login.register`;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mobile: mobile })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                navigate('/otpregister', { state: { mobile, allData } })

            })
            .catch(error => {
                console.error("Error sending OTP", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
        <Box>
  <Typography variant="h5" sx={{ mt: 10, mb: 2,ml:{xs:0,sm:30} }}>
    Complete Your Registration
  </Typography>
</Box>
<ToastContainer />

<Box
  sx={{
    ml: { xs: 0, sm: 28 },
    width: { xs: '100%', sm: '1000px' },
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: { xs: 3, sm: 5 },
    overflow: 'auto',
  }}
>
  <form onSubmit={handleSubmit}>
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pr: { xs: 0, sm: 2 },
            }}
          >
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Enter Mobile No.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <TextField
                sx={{ width: { xs: '100%', sm: '700px' }, mt: 1 }}
                autoComplete="off"
                fullWidth
                id="MobileNumber"
                name="MobileNumber"
                disabled={inputDisabled}
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                InputLabelProps={{ fontSize: 15, fontWeight: 'bold' }}
                InputProps={{
                  sx: {
                    height: '50px',
                    fontSize: '15px',
                    backgroundColor: dataReceived ? 'whiteSmoke' : 'initial',
                  },
                  readOnly: dataReceived,
                }}
                error={error}
              />
              {mobileButtonVisible && (
                <Button
                  onClick={handleCheckNumber}
                  disabled={error || numLoading || mobileNumber === ''}
                  type="submit"
                  sx={{ m: 2, height: 35 }}
                  variant="contained"
                >
                  {numLoading ? <CircularProgress size={20} /> : 'Next'}
                </Button>
              )}
            </Box>

            {statusCode === 200 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Enter GST No.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <TextField
                    sx={{ width: { xs: '100%', sm: '700px' }, mt: 1 }}
                    autoComplete="off"
                    fullWidth
                    id="GSTNO"
                    name="gst_no"
                    value={formData.gst_no}
                    onChange={handleGstNumber}
                    InputLabelProps={{ fontSize: 15, fontWeight: 'bold' }}
                    InputProps={{
                      sx: {
                        height: '50px',
                        fontSize: '15px',
                        backgroundColor: dataReceived ? 'whiteSmoke' : 'initial',
                      },
                      readOnly: dataReceived,
                    }}
                    error={error}
                  />
                  {gstButtonVisible && (
                    <Button
                      onClick={handleCheckGst}
                      disabled={error || gstLoading || formData.gst_no === ''}
                      type="submit"
                      sx={{ m: 2, height: 35 }}
                      variant="contained"
                    >
                      {gstLoading ? <CircularProgress size={20} /> : 'Next'}
                    </Button>
                  )}
                </Box>
                {isVerifying && verificationComplete && (
                  <Typography
                    sx={{
                      color: gstMessageColor,
                      textAlign: 'start',
                      m: 1,
                      fontSize: { xs: '12px', sm: '18px' },
                    }}
                  >
                    {validGST ? (
                      GSTmessage
                    ) : (
                      <Typography sx={{ fontSize: { xs: '12px', sm: '18px' }, color: '#F83839' }}>
                        No Valid GST Number
                      </Typography>
                    )}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Box>
        <Box>
          <Grid container spacing={0} alignItems="center">
            {dataReceived && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Interested as:
                </Typography>
                <FormGroup style={{ display: 'inline' }}>
                  <FormControlLabel
                    control={<Checkbox checked={checkboxes.buyer} onChange={handleCheckboxChange} name="buyer" />}
                    label="Buyer"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={checkboxes.seller} onChange={handleCheckboxChange} name="seller" />}
                    label="Seller"
                  />
                </FormGroup>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button onClick={() => navigate('/login')} sx={{ mt: 2 }} variant="contained">
                Back
              </Button>
              {dataReceived && (
                <Button
                  type="submit"
                  sx={{ mt: 2, ml: 2 }}
                  variant="contained"
                  color="success"
                  disabled={!dataReceived || (!checkboxes.buyer && !checkboxes.seller)}
                >
                  {isLoading ? <CircularProgress size={20} /> : 'Next'}
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        {dataReceived && (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: 'rgba(25,118,210,1)' }}>
              Verify Your GST Details
            </Typography>
            <Card sx={{ pt: 2, pb: 2, pl: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Trade Name:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Typography variant="subtitle1" sx={{ fontFamily: 'lato' }}>
                    {data.trade_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Legal Name:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Typography variant="subtitle1" sx={{ fontFamily: 'lato' }}>
                    {data.legal_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Pan Number:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Typography variant="subtitle1" sx={{ fontFamily: 'lato' }}>
                    {data.pan_number}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Business Address:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Typography variant="subtitle1" sx={{ fontFamily: 'lato' }}>
                    {data.business_address}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </>
        )}
      </Grid>
    </Grid>
  </form>
</Box>

        </>
    );
};

export default GstRegistration;